# LOG PENGEMBANGAN DAN KOREKSI PROSES

## ⚠️ Pelanggaran Prinsip TDD pada DeleteCommentUseCase (Refactor)

**Tanggal:** 19 November 2025

**Detail Kejadian:**

Pada saat implementasi fitur Delete Comment dan melakukan refactoring untuk menghapus validasi payload yang redundan di Use Case (`DeleteCommentUseCase.js`), saya melanggar siklus Test-Driven Development (TDD) yang seharusnya: **RED** (test gagal) -> **GREEN** (implementasi kode) -> **REFACTOR** (optimasi).

Saya melakukan _refactor_ (menghapus validasi di kode sumber) dan langsung _commit_, tanpa terlebih dahulu menghapus unit test terkait yang seharusnya sudah gagal karena validasi telah dihapus.

**Tindakan Koreksi Diri:**

- Kesalahan ini telah diperbaiki di commit berikutnya dengan menghapus unit test yang redundan tersebut.
- Ini menjadi pengingat MANDATORI untuk memastikan setiap perubahan logika pada Use Case/Entity harus diawali dengan kegagalan unit test (jika berlaku).
- **JANGAN PERNAH** meng-_commit_ kode refactoring tanpa menyesuaikan _test_ Use Case terlebih dahulu. Disiplin TDD WAJIB ditingkatkan untuk modul selanjutnya.
