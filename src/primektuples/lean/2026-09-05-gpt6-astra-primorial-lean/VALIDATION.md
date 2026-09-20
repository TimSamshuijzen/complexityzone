# Validation result

Checked on 2026-09-05.

- **Main source:** `PrimorialAudit.lean` compiled successfully, exit code 0, with no warnings.
- **Scope:** 42 proved theorem declarations; 62 named project definitions/theorems audited in total.
- **Axiom audit:** `CheckAxioms.lean` compiled successfully, exit code 0. It rejects dependencies on any axiom other than `propext`, `Classical.choice`, and `Quot.sound`, Lean's standard classical foundations.
- **Placeholders:** No `sorry`, `admit`, `sorryAx`, or newly declared mathematical axiom is used in the formalization. The axiom audit also rules out `native_decide`-style extra reduction axioms.
- **Targets:** `TwinPrimeConjecture`, `HardyLittlewoodConjecture`, and `LocalTupleSupply` are propositions. Their definitions are not proofs. The theorem concluding twin-prime infinitude explicitly assumes `LocalTupleSupply {0,2}`.

Toolchain: Lean 4.19.0, release commit `6caaee842e94`; mathlib tag `v4.19.0`. Mathlib's official compiled cache supplied imported dependencies. The checker generated a fresh `.olean` for the main source, then imported that file for the axiom audit. The full output is preserved in `validation.log`.

The workspace lacked Lean initially, so the official Linux release was installed locally. This workspace does not expose `/proc/PID/exe`; a small I/O adapter supplied the already-known local executable pathname for that one self-discovery operation. The downloaded Lean executable and kernel were unmodified. Ordinary local Lean installations do not need this adapter.

The supplied `lakefile.toml` and `lean-toolchain` describe a normal standalone project. Validation here invoked Lean using the installed mathlib dependency environment; the exact commands are recorded in the log. The README gives the standard Lake commands for reproducing the check on another machine.
