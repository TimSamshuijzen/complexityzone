# Notes on the Lean formalization scaffold

The attached Lean file is a **formalization scaffold**, not a completed proof of the Hardy–Littlewood k-tuple conjecture or the Twin Prime Conjecture.

It does four things:

1. Formalizes the finite primorial-sieve objects: primes, primorials, bit values, candidate tuples, fixed tuple patterns, admissibility, and prime-square windows.
2. States a precise fixed-pattern Hardy–Littlewood asymptotic target using the pattern-dependent residue count `ν_H(p)` and a finite truncation of the singular series.
3. Translates the paper's square-window strategy into precise propositions (`LocalRepresentative`, `ExpectedWindowCountDiverges`, and the window-count conclusion).
4. Leaves `sorry` exactly where a rigorous Lean proof still needs substantive arguments. Running `#print axioms ...` on the final claimed theorems will reveal dependence on `sorryAx` until those gaps are filled.

## Main formalization blockers exposed by the source

- The paper's generic transition factor `p-k` for a k-tuple pattern is not valid without a distinct-residue hypothesis. For a fixed pattern `H`, the exact local sieve factor is `p - ν_H(p)`, where `ν_H(p)` is the number of distinct residues occupied by the offsets modulo `p`. This pattern dependence is also what appears in the Hardy–Littlewood singular series.
- The paper asserts that the modular-inverse parameter `J_{p_n}` is statistically distributed like a fair `(p_n-1)`-sided die, but the cited reason (“primes do not divide each other”) is not a proof of such an equidistribution statement.
- Near-equality of *row totals* in a full primorial-scale matrix does not by itself prove that the short moving interval `[p_n^2,p_{n+1}^2)` has candidate-tuple density asymptotic to the global primorial density. The Lean proposition `LocalRepresentative` isolates this missing implication.
- The paper's final conclusion claims the full Hardy–Littlewood asymptotic frequency, but the window argument as written is aimed at infinitude and does not establish the precise singular-series asymptotic for every fixed admissible pattern.

## Validation

This environment does not have a Lean executable installed, so I could not run `lake build` here. The file targets current Lean 4 + Mathlib APIs and deliberately includes `sorry`; even if it elaborates, it is not a kernel-validated proof until all `sorry` obligations are removed and `#print axioms` reports no `sorryAx` or custom axioms.
