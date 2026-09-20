import PrimorialAudit
import Lean.Util.CollectAxioms

/-! Fail if any project declaration depends on an axiom beyond Lean's
standard classical foundations. Open propositions are not new axioms. -/

open Lean Elab Command

run_cmd do
  let allowed : List Name := [`propext, `Classical.choice, `Quot.sound]
  let declarations : List Name := [
    `PrimorialAudit.sieveBit,
    `PrimorialAudit.bitstring,
    `PrimorialAudit.sieve_step,
    `PrimorialAudit.sieve_periodic,
    `PrimorialAudit.bitstring_six,
    `PrimorialAudit.Candidate,
    `PrimorialAudit.candidateStarts,
    `PrimorialAudit.candidateCount,
    `PrimorialAudit.candidate_step,
    `PrimorialAudit.nu,
    `PrimorialAudit.Admissible,
    `PrimorialAudit.ResidueCandidate,
    `PrimorialAudit.residueCount,
    `PrimorialAudit.residueCandidate_crt,
    `PrimorialAudit.residueCRTEquiv,
    `PrimorialAudit.residueCount_mul,
    `PrimorialAudit.startsResidueEquiv,
    `PrimorialAudit.candidateCount_eq_residueCount,
    `PrimorialAudit.forbidden_card,
    `PrimorialAudit.residueCount_prime,
    `PrimorialAudit.residueCount_one,
    `PrimorialAudit.residueCount_product_primes,
    `PrimorialAudit.candidateCount_primorial,
    `PrimorialAudit.single_count_totient,
    `PrimorialAudit.nu_eq_card_of_residue_injective,
    `PrimorialAudit.nu_eq_card_of_offsets_lt,
    `PrimorialAudit.candidateCount_pos_of_admissible,
    `PrimorialAudit.even_pair_admissible,
    `PrimorialAudit.twins_admissible,
    `PrimorialAudit.gap_six_admissible,
    `PrimorialAudit.twin_starts_mod_thirty,
    `PrimorialAudit.gap_six_starts_mod_thirty,
    `PrimorialAudit.twin_count_mod_thirty,
    `PrimorialAudit.gap_six_count_mod_thirty,
    `PrimorialAudit.same_size_different_counts,
    `PrimorialAudit.gap_six_not_paper_product,
    `PrimorialAudit.local_residue_counts,
    `PrimorialAudit.exactGapStarts,
    `PrimorialAudit.exact_gap_six_starts,
    `PrimorialAudit.exact_gap_six_not_paper_product,
    `PrimorialAudit.NextPrime,
    `PrimorialAudit.nextPrime_covers,
    `PrimorialAudit.prime_dvd_primorial_of_le,
    `PrimorialAudit.prime_of_survives_below_square,
    `PrimorialAudit.tuple_is_prime_below_square,
    `PrimorialAudit.total_over_all_translates,
    `PrimorialAudit.positive_of_discrepancy_bound,
    `PrimorialAudit.symmetricMask,
    `PrimorialAudit.symmetricMask_card,
    `PrimorialAudit.symmetricMask_reflection,
    `PrimorialAudit.symmetricMask_empty_prefix,
    `PrimorialAudit.arbitrarily_large_mean_with_empty_window,
    `PrimorialAudit.eliminator_inverse,
    `PrimorialAudit.first_row_independent_of_J,
    `PrimorialAudit.TwinPrimeConjecture,
    `PrimorialAudit.InfinitelyManyPrimeTuples,
    `PrimorialAudit.LocalTupleSupply,
    `PrimorialAudit.infinitude_of_local_supply,
    `PrimorialAudit.twin_primes_of_local_supply,
    `PrimorialAudit.primeTupleCount,
    `PrimorialAudit.singularSeries,
    `PrimorialAudit.HardyLittlewoodConjecture]
  for name in declarations do
    let axioms ← Lean.collectAxioms name
    for axiomName in axioms do
      unless allowed.contains axiomName do
        throwError "Unexpected axiom {axiomName} in {name}"
    logInfo m!"{name}: {axioms}"
  logInfo "PASS: 62 project declarations checked; only standard foundational axioms."
