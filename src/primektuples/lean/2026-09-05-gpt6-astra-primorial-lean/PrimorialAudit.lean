import Mathlib.NumberTheory.Primorial
import Mathlib.Data.ZMod.Basic
import Mathlib.Algebra.Field.ZMod
import Mathlib.Data.Nat.Totient
import Mathlib.Data.Nat.GCD.BigOperators
import Mathlib.Analysis.SpecialFunctions.Log.Basic
import Mathlib.Topology.Algebra.InfiniteSum.Defs
import Mathlib.Tactic.Linarith

/-!
# Formal audit of Samshuijzen's primorial-sieve manuscript

Source: *Proof of the Hardy-Littlewood k-Tuple Conjecture in the Distribution
of Numbers Coprime with the Primorial*, revision July 2026, supplied PDF.

This file is a partial formalization and a proof-gap audit, NOT a proof of
Hardy-Littlewood or the twin-prime conjecture. All theorem declarations below
are proved. Open assertions are defined as propositions, not introduced as
axioms. The final implication has an explicit unproved local-supply hypothesis.

Target: Lean 4.19.0 / mathlib v4.19.0.
-/

set_option autoImplicit false
set_option maxRecDepth 4096

open scoped BigOperators Topology
open Filter

namespace PrimorialAudit

/-! ## The sieve and its exact arithmetic meaning (Sections 2 and 7) -/

/-- The bit at the integer index `a`, extended periodically beyond one period. -/
def sieveBit (M a : ℕ) : Bool := decide (Nat.Coprime a M)

/-- The finite one-based bitstring used in the paper. -/
def bitstring (M : ℕ) : List Bool :=
  (List.range M).map (fun i => sieveBit M (i + 1))

/-- Adding a prime to the sieve removes exactly its multiples among survivors. -/
theorem sieve_step {M p a : ℕ} (hp : Nat.Prime p) :
    Nat.Coprime a (M * p) ↔ Nat.Coprime a M ∧ ¬ p ∣ a := by
  rw [Nat.coprime_mul_iff_right, Nat.coprime_comm (m := p), hp.coprime_iff_not_dvd]

/-- Periodicity is exact; it says nothing about the density in a short subinterval. -/
theorem sieve_periodic (M a : ℕ) : sieveBit M (a + M) = sieveBit M a := by
  simp [sieveBit, Nat.coprime_add_self_left]

/-- The compact arithmetic definition reproduces the paper's `S_3`. -/
theorem bitstring_six : bitstring 6 = [true, false, false, false, true, false] := by
  decide

/-- The offsets specify required 1s; unspecified positions are unrestricted. -/
def Candidate (M : ℕ) (H : Finset ℕ) (a : ℕ) : Prop :=
  ∀ h ∈ H, Nat.Coprime (a + h) M

instance (M : ℕ) (H : Finset ℕ) (a : ℕ) : Decidable (Candidate M H a) :=
  inferInstanceAs (Decidable (∀ h ∈ H, Nat.Coprime (a + h) M))

/-- Complete-period tuple starts, with wraparound handled by periodicity. -/
def candidateStarts (M : ℕ) (H : Finset ℕ) : Finset ℕ :=
  (Finset.range M).filter (Candidate M H)

def candidateCount (M : ℕ) (H : Finset ℕ) : ℕ :=
  (candidateStarts M H).card

/-- Tuples survive a sieve step iff every offset avoids the new prime. -/
theorem candidate_step {M p a : ℕ} {H : Finset ℕ} (hp : Nat.Prime p) :
    Candidate (M * p) H a ↔ Candidate M H a ∧ ∀ h ∈ H, ¬ p ∣ a + h := by
  simp only [Candidate, sieve_step hp]
  constructor
  · intro h
    exact ⟨fun d hd => (h d hd).1, fun d hd => (h d hd).2⟩
  · rintro ⟨h₁, h₂⟩ d hd
    exact ⟨h₁ d hd, h₂ d hd⟩

/-- Number of distinct offset residues, the quantity that matters in the sieve. -/
def nu (H : Finset ℕ) (p : ℕ) : ℕ :=
  (H.image (fun h => h % p)).card

/-- Admissibility: no prime has every residue forbidden by the tuple. -/
def Admissible (H : Finset ℕ) : Prop :=
  ∀ p : ℕ, Nat.Prime p → nu H p < p

/-! ## Exact Chinese-remainder counting -/

def ResidueCandidate (M : ℕ) (H : Finset ℕ) (a : ZMod M) : Prop :=
  ∀ h ∈ H, IsUnit (a + (h : ZMod M))

noncomputable def residueCount (M : ℕ) (H : Finset ℕ) : ℕ :=
  Nat.card {a : ZMod M // ResidueCandidate M H a}

theorem residueCandidate_crt {m n : ℕ} (hcop : Nat.Coprime m n)
    (H : Finset ℕ) (a : ZMod (m * n)) :
    ResidueCandidate (m * n) H a ↔
      ResidueCandidate m H ((ZMod.chineseRemainder hcop a).1) ∧
      ResidueCandidate n H ((ZMod.chineseRemainder hcop a).2) := by
  let e := ZMod.chineseRemainder hcop
  have he (d : ℕ) : IsUnit (a + (d : ZMod (m * n))) ↔
      IsUnit ((e a).1 + (d : ZMod m)) ∧ IsUnit ((e a).2 + (d : ZMod n)) := by
    calc
      IsUnit (a + (d : ZMod (m * n))) ↔ IsUnit (e (a + (d : ZMod (m * n)))) :=
        e.toMulEquiv.isUnit_map.symm
      _ ↔ _ := by simp [Prod.isUnit_iff]
  simp only [ResidueCandidate, he]
  constructor
  · intro h
    exact ⟨fun d hd => (h d hd).1, fun d hd => (h d hd).2⟩
  · rintro ⟨h₁, h₂⟩ d hd
    exact ⟨h₁ d hd, h₂ d hd⟩

noncomputable def residueCRTEquiv {m n : ℕ} (hcop : Nat.Coprime m n)
    (H : Finset ℕ) :
    {a : ZMod (m * n) // ResidueCandidate (m * n) H a} ≃
      ({a : ZMod m // ResidueCandidate m H a} ×
       {a : ZMod n // ResidueCandidate n H a}) where
  toFun a :=
    (⟨(ZMod.chineseRemainder hcop a.val).1,
      ((residueCandidate_crt hcop H a.val).mp a.property).1⟩,
     ⟨(ZMod.chineseRemainder hcop a.val).2,
      ((residueCandidate_crt hcop H a.val).mp a.property).2⟩)
  invFun a :=
    ⟨(ZMod.chineseRemainder hcop).symm (a.1.val, a.2.val), by
      apply (residueCandidate_crt hcop H _).mpr
      simpa using And.intro a.1.property a.2.property⟩
  left_inv a := by
    apply Subtype.ext
    exact (ZMod.chineseRemainder hcop).symm_apply_apply a.val
  right_inv a := by
    apply Prod.ext <;> apply Subtype.ext
    · exact congrArg Prod.fst ((ZMod.chineseRemainder hcop).apply_symm_apply (a.1.val, a.2.val))
    · exact congrArg Prod.snd ((ZMod.chineseRemainder hcop).apply_symm_apply (a.1.val, a.2.val))

theorem residueCount_mul {m n : ℕ} (hcop : Nat.Coprime m n) (H : Finset ℕ) :
    residueCount (m * n) H = residueCount m H * residueCount n H := by
  unfold residueCount
  rw [Nat.card_congr (residueCRTEquiv hcop H), Nat.card_prod]


/-- Natural starts and residue-ring starts are the same finite set. -/
noncomputable def startsResidueEquiv (M : ℕ) [NeZero M] (H : Finset ℕ) :
    {a : ℕ // a ∈ candidateStarts M H} ≃
      {a : ZMod M // ResidueCandidate M H a} where
  toFun a := ⟨(a.val : ZMod M), by
    intro h hh
    have hc := (Finset.mem_filter.mp a.property).2 h hh
    simpa only [Nat.cast_add] using (ZMod.isUnit_iff_coprime (a.val + h) M).mpr hc⟩
  invFun a := ⟨a.val.val, by
    apply Finset.mem_filter.mpr
    refine ⟨Finset.mem_range.mpr a.val.val_lt, ?_⟩
    intro h hh
    apply (ZMod.isUnit_iff_coprime (a.val.val + h) M).mp
    simpa only [Nat.cast_add, ZMod.natCast_zmod_val] using a.property h hh⟩
  left_inv a := by
    apply Subtype.ext
    exact ZMod.val_natCast_of_lt (Finset.mem_range.mp (Finset.mem_filter.mp a.property).1)
  right_inv a := by
    apply Subtype.ext
    exact ZMod.natCast_zmod_val a.val

theorem candidateCount_eq_residueCount (M : ℕ) [NeZero M] (H : Finset ℕ) :
    candidateCount M H = residueCount M H := by
  rw [candidateCount, ← Nat.card_eq_finsetCard,
    Nat.card_congr (startsResidueEquiv M H)]
  rfl

/-- The forbidden residue set has exactly nu_p(H) elements. -/
theorem forbidden_card {p : ℕ} (hp : 0 < p) (H : Finset ℕ) :
    (H.image (fun h : ℕ => -(h : ZMod p))).card = nu H p := by
  classical
  let R := H.image (fun h => h % p)
  have hlt : ∀ r ∈ R, r < p := by
    intro r hr
    obtain ⟨h, hh, rfl⟩ := Finset.mem_image.mp hr
    exact Nat.mod_lt _ hp
  have heq : H.image (fun h : ℕ => -(h : ZMod p)) =
      R.image (fun r : ℕ => -(r : ZMod p)) := by
    simp [R, Finset.image_image, Function.comp_def, ZMod.natCast_mod]
  have hinj : Set.InjOn (fun r : ℕ => -(r : ZMod p)) (↑R : Set ℕ) := by
    intro r hr s hs hrs
    have he := congrArg ZMod.val (neg_injective hrs)
    simpa only [ZMod.val_natCast, Nat.mod_eq_of_lt (hlt r hr),
      Nat.mod_eq_of_lt (hlt s hs)] using he
  rw [heq, Finset.card_image_iff.mpr hinj]
  rfl

/-- The corrected local factor is p - nu_p(H), not p - |H| in general. -/
theorem residueCount_prime {p : ℕ} (hp : Nat.Prime p) (H : Finset ℕ) :
    residueCount p H = p - nu H p := by
  classical
  letI : Fact (Nat.Prime p) := ⟨hp⟩
  let F : Finset (ZMod p) := H.image (fun h : ℕ => -(h : ZMod p))
  have he (a : ZMod p) : ResidueCandidate p H a ↔ a ∉ F := by
    simp [ResidueCandidate, F, isUnit_iff_ne_zero, add_eq_zero_iff_eq_neg, eq_comm]
  let e : {a : ZMod p // ResidueCandidate p H a} ≃ {a : ZMod p // a ∉ F} :=
    (Equiv.refl (ZMod p)).subtypeEquiv (fun a => he a)
  rw [residueCount, Nat.card_congr e, Nat.card_eq_fintype_card,
    Fintype.card_subtype_compl]
  simp only [ZMod.card, Fintype.card_coe]
  rw [forbidden_card hp.pos H]

theorem residueCount_one (H : Finset ℕ) : residueCount 1 H = 1 := by
  classical
  letI : Inhabited {a : ZMod 1 // ResidueCandidate 1 H a} := ⟨⟨0, by
    intro h hh
    have he : (0 + (h : ZMod 1)) = 1 := Subsingleton.elim _ _
    rw [he]
    exact isUnit_one⟩⟩
  unfold residueCount
  exact Nat.card_unique

/-- The full exact product formula, obtained by iterating the CRT. -/
theorem residueCount_product_primes (S : Finset ℕ)
    (hS : ∀ p ∈ S, Nat.Prime p) (H : Finset ℕ) :
    residueCount (∏ p ∈ S, p) H = ∏ p ∈ S, (p - nu H p) := by
  induction S using Finset.induction_on with
  | empty => simp [residueCount_one]
  | @insert p S hnot ih =>
    have hp : Nat.Prime p := hS p (Finset.mem_insert_self p S)
    have hS' : ∀ q ∈ S, Nat.Prime q := fun q hq => hS q (Finset.mem_insert_of_mem hq)
    have hc : Nat.Coprime p (∏ q ∈ S, q) := by
      apply Nat.coprime_prod_right_iff.mpr
      intro q hq
      apply hp.coprime_iff_not_dvd.mpr
      intro hd
      have heq := (Nat.prime_dvd_prime_iff_eq hp (hS' q hq)).mp hd
      exact hnot (heq.symm ▸ hq)
    rw [Finset.prod_insert hnot, residueCount_mul hc H,
      residueCount_prime hp H, ih hS', Finset.prod_insert hnot]

/-- Corrected replacement for Equation (4), for arbitrary required offsets. -/
theorem candidateCount_primorial (z : ℕ) (H : Finset ℕ) :
    candidateCount (primorial z) H =
      ∏ p ∈ (Finset.range (z + 1)).filter Nat.Prime, (p - nu H p) := by
  letI : NeZero (primorial z) := ⟨Nat.ne_of_gt (primorial_pos z)⟩
  rw [candidateCount_eq_residueCount, primorial]
  apply residueCount_product_primes
  intro p hp
  exact (Finset.mem_filter.mp hp).2

/-- Section 4's one-point count is Euler's totient. -/
theorem single_count_totient (M : ℕ) : candidateCount M {0} = Nat.totient M := by
  unfold candidateCount candidateStarts Nat.totient
  congr 1
  ext a
  simp [Candidate, Nat.coprime_comm]

/-- The paper's p-k factor is valid once the offsets are distinct modulo p. -/
theorem nu_eq_card_of_residue_injective (H : Finset ℕ) (p : ℕ)
    (hinj : Set.InjOn (fun h : ℕ => h % p) (↑H : Set ℕ)) :
    nu H p = H.card := by
  exact Finset.card_image_iff.mpr hinj

theorem nu_eq_card_of_offsets_lt (H : Finset ℕ) (p : ℕ)
    (hlt : ∀ h ∈ H, h < p) : nu H p = H.card := by
  apply nu_eq_card_of_residue_injective
  intro a ha b hb he
  simpa only [Nat.mod_eq_of_lt (hlt a ha), Nat.mod_eq_of_lt (hlt b hb)] using he

/-- Every admissible pattern occurs in each whole primorial period.
This result alone does not place a start below the next prime square. -/
theorem candidateCount_pos_of_admissible (z : ℕ) {H : Finset ℕ}
    (hadm : Admissible H) : 0 < candidateCount (primorial z) H := by
  rw [candidateCount_primorial]
  apply Finset.prod_pos
  intro p hp
  exact Nat.sub_pos_of_lt (hadm p (Finset.mem_filter.mp hp).2)

/-- In particular, both two-offset patterns in the counterexample are admissible. -/
theorem even_pair_admissible (d : ℕ) (hd : d % 2 = 0) : Admissible {0, d} := by
  intro p hp
  by_cases htwo : p = 2
  · subst p
    simp [nu, hd]
  · have hle : nu {0, d} p ≤ 2 := by
      calc
        nu {0, d} p ≤ ({0, d} : Finset ℕ).card := Finset.card_image_le
        _ ≤ 2 := by
          have h := Finset.card_insert_le 0 ({d} : Finset ℕ)
          simpa using h
    have hlow := hp.two_le
    omega

theorem twins_admissible : Admissible {0, 2} :=
  even_pair_admissible 2 (by decide)

theorem gap_six_admissible : Admissible {0, 6} :=
  even_pair_admissible 6 (by decide)

/-! ## Concrete obstruction to the manuscript's universal formula (Section 4) -/

theorem twin_starts_mod_thirty : candidateStarts 30 {0, 2} = {11, 17, 29} := by
  decide

theorem gap_six_starts_mod_thirty :
    candidateStarts 30 {0, 6} = {1, 7, 11, 13, 17, 23} := by
  decide

theorem twin_count_mod_thirty : candidateCount 30 {0, 2} = 3 := by decide

theorem gap_six_count_mod_thirty : candidateCount 30 {0, 6} = 6 := by decide

/-- Same tuple size, different count: the count cannot be a function of k alone. -/
theorem same_size_different_counts :
    ({0, 2} : Finset ℕ).card = ({0, 6} : Finset ℕ).card ∧
    candidateCount 30 {0, 2} ≠ candidateCount 30 {0, 6} := by
  decide

theorem gap_six_not_paper_product :
    candidateCount 30 {0, 6} ≠ (3 - 2) * (5 - 2) := by decide

/-- The discrepancy comes from the collision of 0 and 6 modulo 3. -/
theorem local_residue_counts :
    nu {0, 2} 3 = 2 ∧ nu {0, 6} 3 = 1 := by decide

/-- Literal 1,0,0,0,0,0,1 patterns additionally forbid every intervening 1. -/
def exactGapStarts (M d : ℕ) : Finset ℕ :=
  (candidateStarts M {0, d}).filter
    (fun a => ∀ j ∈ Finset.Ioo 0 d, ¬ Nat.Coprime (a + j) M)

/-- Even under the paper's literal bit-pattern reading, the claimed count 3 fails. -/
theorem exact_gap_six_starts : exactGapStarts 30 6 = {1, 23} := by decide

theorem exact_gap_six_not_paper_product :
    (exactGapStarts 30 6).card ≠ (3 - 2) * (5 - 2) := by decide

/-! ## Being coprime below the next prime square really does certify primality -/

/-- Precise version of consecutive primes, avoiding any indexing convention. -/
def NextPrime (p q : ℕ) : Prop :=
  Nat.Prime p ∧ Nat.Prime q ∧ p < q ∧
    ∀ r : ℕ, Nat.Prime r → p < r → q ≤ r

/-- No prime below the next prime is missed by the current primorial. -/
theorem nextPrime_covers {p q r : ℕ} (h : NextPrime p q)
    (hr : Nat.Prime r) (hrq : r < q) : r ≤ p := by
  by_contra hn
  have := h.2.2.2 r hr (by omega)
  omega

/-- Every prime at most the cutoff divides the primorial. -/
theorem prime_dvd_primorial_of_le {r p : ℕ} (hr : Nat.Prime r) (hle : r ≤ p) :
    r ∣ primorial p := by
  apply Finset.dvd_prod_of_mem
  exact Finset.mem_filter.mpr ⟨Finset.mem_range.mpr (by omega), hr⟩

/-- A composite below q^2 has a prime factor below q, hence cannot survive. -/
theorem prime_of_survives_below_square {p q a : ℕ}
    (hcover : ∀ r : ℕ, Nat.Prime r → r < q → r ≤ p)
    (ha : 1 < a) (hbound : a < q ^ 2)
    (hsieve : Nat.Coprime a (primorial p)) : Nat.Prime a := by
  by_contra hnot
  have hfac : Nat.Prime (Nat.minFac a) := Nat.minFac_prime (by omega)
  have hsq := Nat.minFac_sq_le_self (by omega : 0 < a) hnot
  have hlt : Nat.minFac a < q := by nlinarith
  have hdiv : Nat.minFac a ∣ primorial p :=
    prime_dvd_primorial_of_le hfac (hcover _ hfac hlt)
  have hone : Nat.minFac a ∣ 1 := by
    rw [← hsieve.gcd_eq_one]
    exact Nat.dvd_gcd (Nat.minFac_dvd a) hdiv
  exact hfac.not_dvd_one hone

/-- Section 6, including the bounds needed for every member of a tuple. -/
theorem tuple_is_prime_below_square {p q a : ℕ} {H : Finset ℕ}
    (hnext : NextPrime p q)
    (hlower : ∀ h ∈ H, 1 < a + h)
    (hupper : ∀ h ∈ H, a + h < q ^ 2)
    (hc : Candidate (primorial p) H a) :
    ∀ h ∈ H, Nat.Prime (a + h) := by
  intro h hh
  exact prime_of_survives_below_square
    (fun r hr hlt => nextPrime_covers hnext hr hlt)
    (hlower h hh) (hupper h hh) (hc h hh)

/-! ## Global balance does not imply occupancy of a selected short interval -/

/-- Section 6's average is justified when ALL translations are averaged.
There is no corresponding theorem here for one prescribed translation. -/
theorem total_over_all_translates (M : ℕ) [NeZero M]
    (T : Finset (ZMod M)) (f : ZMod M → ℝ) :
    (∑ a : ZMod M, ∑ h ∈ T, f (a + h)) =
      (T.card : ℝ) * ∑ a : ZMod M, f a := by
  rw [Finset.sum_comm]
  have hs (h : ZMod M) : (∑ a : ZMod M, f (a + h)) = ∑ a : ZMod M, f a := by
    exact Equiv.sum_comp (Equiv.addRight h) f
  simp_rw [hs]
  simp

/-- A possible kind of missing estimate: an error strictly smaller than a
positive mean certifies a positive actual count. No such estimate for the
prime-square windows is proved by the manuscript or asserted in this file. -/
theorem positive_of_discrepancy_bound (actual mean : ℝ)
    (_hmean : 0 < mean) (herror : |actual - mean| < mean) : 0 < actual := by
  have h := (abs_lt.mp herror).1
  linarith

/-- A deliberately simple symmetric mask; this is a logical countermodel to
an inference from averages, not a counterexample to a prime conjecture. -/
def symmetricMask (L : ℕ) : Finset ℕ := Finset.Icc L (3 * L)

theorem symmetricMask_card (L : ℕ) : (symmetricMask L).card = 2 * L + 1 := by
  simp [symmetricMask, Nat.card_Icc]
  omega

theorem symmetricMask_reflection {L : ℕ} (hL : 0 < L) (i : ℕ) :
    i ∈ symmetricMask L ↔ 4 * L - i ∈ symmetricMask L := by
  simp only [symmetricMask, Finset.mem_Icc]
  omega

theorem symmetricMask_empty_prefix (L : ℕ) :
    Disjoint (Finset.range L) (symmetricMask L) := by
  apply Finset.disjoint_left.mpr
  intro i hi hm
  have hi' := Finset.mem_range.mp hi
  have hm' := (Finset.mem_Icc.mp hm).1
  omega

/--
For arbitrarily large B there is a symmetric period with an EMPTY selected
window whose uniform-translation average would exceed B. The final inequality
is `B < window_length * period_count / period_length`, with denominators
cleared. Repeating the mask as matrix rows gives exactly equal row counts.
This does not assert that the mask is generated by the prime sieve.
-/
theorem arbitrarily_large_mean_with_empty_window (B : ℕ) :
    ∃ L : ℕ, 0 < L ∧
      symmetricMask L ⊆ Finset.range (4 * L) ∧
      Disjoint (Finset.range L) (symmetricMask L) ∧
      B * (4 * L) < L * (symmetricMask L).card ∧
      (∀ i : ℕ, i ∈ symmetricMask L ↔ 4 * L - i ∈ symmetricMask L) := by
  refine ⟨2 * B + 2, by omega, ?_, symmetricMask_empty_prefix _, ?_, ?_⟩
  · intro i hi
    have := (Finset.mem_Icc.mp hi).2
    apply Finset.mem_range.mpr
    omega
  · rw [symmetricMask_card]
    nlinarith
  · exact symmetricMask_reflection (by omega)

/-- Equation (14)'s modular-inverse characterization is algebraic. -/
theorem eliminator_inverse {p M : ℕ} (hp : Nat.Prime p)
    (hcop : Nat.Coprime M p) :
    1 + (-(M : ZMod p)⁻¹) * (M : ZMod p) = 0 := by
  letI : Fact (Nat.Prime p) := ⟨hp⟩
  have hne : (M : ZMod p) ≠ 0 :=
    (ZMod.isUnit_iff_coprime M p).mpr hcop |>.ne_zero
  simp [hne]

/-- Changing a nonzero J cannot change which columns eliminate in row 1. -/
theorem first_row_independent_of_J {p : ℕ} (hp : Nat.Prime p)
    (J c : ZMod p) (hJ : J ≠ 0) : J * c = 0 ↔ c = 0 := by
  letI : Fact (Nat.Prime p) := ⟨hp⟩
  simp [mul_eq_zero, hJ]

/-! ## Exact target statements and the unresolved local step (Sections 8-10) -/

/-- Infinitely many twin primes, expressed as unbounded smaller members. -/
def TwinPrimeConjecture : Prop :=
  ∀ B : ℕ, ∃ a : ℕ, B < a ∧ Nat.Prime a ∧ Nat.Prime (a + 2)

/-- The general infinitude claim for a fixed tuple. -/
def InfinitelyManyPrimeTuples (H : Finset ℕ) : Prop :=
  ∀ B : ℕ, ∃ a : ℕ, B < a ∧ ∀ h ∈ H, Nat.Prime (a + h)

/--
OPEN OBLIGATION. A precise sufficient form of the paper's local-supply claim.
It requires arbitrarily far out actual survivors in the relevant intervals.
Whole-period counts or row averages do not constitute a proof of this assertion.
-/
def LocalTupleSupply (H : Finset ℕ) : Prop :=
  ∀ B : ℕ, ∃ p q a : ℕ,
    NextPrime p q ∧ B < a ∧ p ^ 2 < a ∧
    (∀ h ∈ H, a + h < q ^ 2) ∧ Candidate (primorial p) H a

/-- The remaining elementary implication; the crucial hypothesis is explicit. -/
theorem infinitude_of_local_supply {H : Finset ℕ}
    (hlocal : LocalTupleSupply H) : InfinitelyManyPrimeTuples H := by
  intro B
  obtain ⟨p, q, a, hn, hB, hlow, hupp, hc⟩ := hlocal B
  refine ⟨a, hB, tuple_is_prime_below_square hn ?_ hupp hc⟩
  intro h hh
  have hp := hn.1.two_le
  nlinarith

/-- Conditional, not an unconditional proof of the twin-prime conjecture. -/
theorem twin_primes_of_local_supply
    (hlocal : LocalTupleSupply {0, 2}) : TwinPrimeConjecture := by
  intro B
  obtain ⟨a, hB, ha⟩ := infinitude_of_local_supply hlocal B
  refine ⟨a, hB, ?_, ha 2 (by simp)⟩
  simpa using ha 0 (by simp)

/-- Exact prime-tuple count with start a in [0,x). -/
def primeTupleCount (H : Finset ℕ) (x : ℕ) : ℕ :=
  ((Finset.range x).filter (fun a => ∀ h ∈ H, Nat.Prime (a + h))).card

/-- The correct pattern-dependent singular series. Its positivity and
convergence require proofs; this definition alone does not supply them. -/
noncomputable def singularSeries (H : Finset ℕ) : ℝ :=
  ∏' p : Nat.Primes,
    (1 - (nu H p.val : ℝ) / (p.val : ℝ)) /
      (1 - 1 / (p.val : ℝ)) ^ H.card

/-- OPEN TARGET, not a theorem. Normalized Hardy-Littlewood asymptotic. -/
def HardyLittlewoodConjecture : Prop :=
  ∀ H : Finset ℕ, H.Nonempty → Admissible H →
    0 < singularSeries H ∧
    Tendsto (fun x : ℕ =>
      (primeTupleCount H x : ℝ) /
        (singularSeries H * (x : ℝ) / (Real.log (x : ℝ)) ^ H.card))
      atTop (𝓝 1)

end PrimorialAudit
