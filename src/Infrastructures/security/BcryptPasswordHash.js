import AuthenticationError from "../../Commons/exceptions/AuthenticationError.js";
import PasswordHash from "../../Applications/security/PasswordHash.js";

class BcryptPasswordHash extends PasswordHash {
  constructor(bcrypt, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(password) {
    return this._bcrypt.hash(password, this._saltRound);
  }

  async comparePassword(plain, encrypted) {
    const result = await this._bcrypt.compare(plain, encrypted);
    if (!result) {
      throw new AuthenticationError("kredensial yang Anda masukkan salah");
    }
  }

  // Menambahkan alias 'compare' berjaga-jaga jika pengujian memanggil nama ini
  async compare(plain, encrypted) {
    const result = await this._bcrypt.compare(plain, encrypted);
    if (!result) {
      throw new AuthenticationError("kredensial yang Anda masukkan salah");
    }
  }
}

export default BcryptPasswordHash;
