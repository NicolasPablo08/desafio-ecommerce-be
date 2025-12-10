import { sequelize } from "lib/connections/sequelize";
import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";

//interface AuthAttributes y los declares solo son nesesarios para que ts no indique errores de tipos
export default class Auth extends Model<InferAttributes<Auth>, InferCreationAttributes<Auth>> {
  declare email: string;
  declare userId: string;
  declare code: number | null;
  declare codeExpires: Date | null;

  static async findAuthByEmail(email: string) {
    // @ts-ignore
    const auth = await Auth.findOne({ where: { email } });
    if (auth) {
      return auth;
    }
    return null;
  }

  static async createAuth(email: string, userId: string) {
    // @ts-ignore
    const newAuth = await Auth.create({ email, userId });
    return newAuth;
  }
  static async updateAuth(code, codeExpires, email) {
    console.log(code, codeExpires, email);

    // @ts-ignore
    const [affectedRows] = await Auth.update({ code, codeExpires }, { where: { email } });
    console.log(affectedRows);

    return affectedRows > 0; // true si actualizó, false si no encontró email
  }
}
Auth.init(
  {
    email: DataTypes.STRING,
    userId: DataTypes.STRING,
    code: DataTypes.INTEGER,
    codeExpires: DataTypes.DATE,
  },
  { sequelize, modelName: "auth" }
);
