# Primorial sieve: Lean formalization and proof audit

This project is a **partial formalization of the supplied manuscript, with a corrected finite counting theorem and explicit identification of the missing argument**. It is not a proof of the Hardy–Littlewood conjecture or the twin-prime conjecture.

Source examined: Tim Samshuijzen, *Proof of the Hardy-Littlewood k-Tuple Conjecture in the Distribution of Numbers Coprime with the Primorial*, January 2025, revision July 2026; all 25 pages of the attached PDF. References to page numbers below mean the printed PDF pages.

The code uses mathlib's `Nat.Prime`, `Nat.Coprime`, `primorial`, `ZMod`, real numbers, and filter limits. It does not redefine primality to make the desired conclusion easier. Tuple patterns are finite sets of nonnegative offsets; a fixed integer pattern can first be translated to this convention.

## What the code formalizes

| Manuscript component | Lean declaration | Status and scope |
| --- | --- | --- |
| Sections 2 and 7, the compact arithmetic sieve | `sieve_step`, `candidate_step`, `sieve_periodic` | Exact arithmetic recurrence and periodicity; the imperative CONCAT/STRETCH implementation is not separately verified. |
| Section 4, single candidates | `single_count_totient` | The complete-period count is Euler's totient. |
| Section 4, general tuple counts | `candidateCount_primorial` | Corrected full product formula, proved using an explicit Chinese-remainder equivalence. |
| When a factor really is `p-k` | `nu_eq_card_of_residue_injective`, `nu_eq_card_of_offsets_lt` | Requires distinct offset residues. |
| Admissible candidates exist in whole periods | `candidateCount_pos_of_admissible` | Proves a positive period count; does not locate candidates in a short interval. |
| Section 4's claimed gap-six count | `gap_six_not_paper_product`, `exact_gap_six_not_paper_product` | Refuted under both the ordinary tuple interpretation and the literal zero-filled bit-pattern interpretation. |
| Section 6, certifying surviving candidates as prime | `prime_of_survives_below_square`, `tuple_is_prime_below_square` | Proved using the least prime factor of a hypothetical composite. Every tuple member must satisfy the bound. |
| Section 6, averaging translated windows | `total_over_all_translates` | Exact identity for all translations. |
| Section 8, modular inverse description | `eliminator_inverse`, `first_row_independent_of_J` | The algebraic description is proved; no randomness assertion is inferred. |
| Sections 8–9, inference from symmetry/averages to local occupancy | `arbitrarily_large_mean_with_empty_window` | A symmetric periodic countermodel shows that these properties alone do not imply occupancy. It is not a counterexample to the prime sieve or either conjecture. |
| A sufficient local-survivor statement | `LocalTupleSupply` | An explicitly unproved proposition. |
| Local supply implies infinitude | `infinitude_of_local_supply`, `twin_primes_of_local_supply` | Conditional theorems with the unproved hypothesis visible. |
| Full Hardy–Littlewood asymptotic | `HardyLittlewoodConjecture` | Precisely stated as a proposition, not proved. |

## The finite counting error can be repaired

For a finite offset pattern H, let ν_p(H) be the number of distinct residue classes occupied by H modulo p. Let P be the product of the primes up to z. Then the exact complete-period count is

\[
C_H(P)=\#\{0\le a<P:\gcd(a+h,P)=1\text{ for every }h\in H\}
       =\prod_{p\le z}(p-\nu_p(H)).
\]

Each offset forbids the residue `-h` modulo p. Distinct offsets can forbid the same residue. The Chinese remainder theorem combines the allowed residue choices independently across distinct prime moduli. The code proves this identity, including its connection to the executable natural-number count.

The paper's replacement of ν_p(H) with k in its general claim on pp. 8–9 is invalid. For P = 30:

| Pattern | Complete-period start residues | Count |
| --- | --- | ---: |
| H = {0,2}, candidate twins | 11, 17, 29 | 3 |
| H = {0,6}, candidate gap-six pairs | 1, 7, 11, 13, 17, 23 | 6 |
| Literal pattern 1,0,0,0,0,0,1 | 1, 23 | 2 |

The paper claims that the same count `(3-2)(5-2)=3` covers these cases. Both two-offset patterns are admissible. Modulo 3, the twin offsets occupy two classes while the gap-six offsets occupy only one. A sieve can eliminate both members of the latter pair at once.

Thus a `sorry` for the universal count as written cannot be filled soundly: the statement is false. It must be replaced with the corrected theorem. This repair does not settle the later local-distribution problem.

## The decisive missing argument remains

On p. 21, Equation (15) treats the modular inverses J_p as having a dice-like distribution and asserts an average limit of 1/2. Mutual nondivisibility of primes does not prove this distribution claim. Moreover, a first-moment assertion about J_p, even if established, would not control its correlations with surviving tuple positions.

Equation (16), on p. 23, also needs a precise interpretation: its right-hand side still depends on n after taking a limit on the left. For example, a meaningful relative statement would concern

\[
\max_{1\le r\le p_n}\left|
\frac{E_{n,r}}{\varphi(p_{n-1}\#)/p_n}-1\right|\longrightarrow0.
\]

This is an illustration of how to state row balance, not a claim that the manuscript proves it. Even such row balance concerns rows of primorial length. It does not give an error bound on the particular much shorter region near p_n². Counts of individual eliminations also do not by themselves control elimination of a correlated k-tuple pattern.

The countermodel in the Lean file makes the logical distinction explicit. In a period of length 4L, put 1s precisely at positions L through 3L. This is symmetric, has 2L+1 ones, and has an empty initial window of length L. The average count in a uniformly translated window is `(2L+1)/4`, which grows without bound. Repeating this row makes row totals exactly equal. The selected empty window remains empty. The actual prime sieve has additional arithmetic structure; a valid proof must use that structure to establish the required local estimate.

## What would resolve the remaining obligation?

For consecutive primes p < q, all surviving integers a with `1 < a < q²` are prime. The code proves this. Therefore one sufficient remaining statement is:

For every bound B, there are consecutive primes p < q and a > B with p² < a, such that every a+h lies below q² and every a+h is coprime to p#.

That is exactly the explicitly named proposition `LocalTupleSupply H`. For H = {0,2}, the proved implication is:

```lean
theorem twin_primes_of_local_supply
    (hlocal : LocalTupleSupply {0, 2}) : TwinPrimeConjecture
```

**The hypothesis has not been proved.** Moving the missing reasoning into a named hypothesis makes the dependency visible; it does not resolve it.

One possible route would be a genuine discrepancy or lower-bound estimate for actual counts in arbitrarily far out prime-square windows. For example, if an actual count A and a positive proposed mean μ satisfy `|A-μ| < μ`, then A > 0; the code proves this elementary implication. The difficult task is proving an applicable estimate for the sieve's prescribed windows. No such estimate is established in the paper. It would not be justified to assume a ratio-to-mean limit solely from the periodic density.

Even resolving infinitude would leave the stronger Hardy–Littlewood asymptotic to prove:

\[
N_H(x)\sim\mathfrak S(H)\frac{x}{(\log x)^{|H|}},\qquad
\mathfrak S(H)=\prod_p\frac{1-\nu_p(H)/p}{(1-1/p)^{|H|}}.
\]

This standard target and its pattern-dependent constant are described in [Kiran Kedlaya's analytic number theory notes, Section 19.1](https://kskedlaya.org/ant/chap-k-tuples.html). In the code, positivity of the singular series is part of the target; convergence and positivity are not silently inferred from defining an infinite product. Standard analytic work on those products is separate from the missing prime-tuple asymptotic.

## Build

Pinned dependencies: Lean 4.19.0 and mathlib v4.19.0. With Lean's normal toolchain manager installed, run from this folder:

```bash
lake update
lake exe cache get
lake build
lake env lean CheckAxioms.lean
```

The project deliberately contains no proof placeholders and introduces no new axioms. The open mathematical claims appear as `def ... : Prop`, which are statements, not proofs. There is no unconditional theorem of twin-prime or Hardy–Littlewood infinitude here.

See `VALIDATION.md` and `validation.log` for the actual compiler-check result and its environment details.
