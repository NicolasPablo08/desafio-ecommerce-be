import { sequelize } from "lib/connections/sequelize";
import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import random from "random-string-alphanumeric-generator";

//interface AuthAttributes y los declares solo son nesesarios para que ts no indique errores de tipos
export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: string;
  declare email: string;
  declare name: string | null;
  declare lastName: string | null;
  declare address: string | null;

  static async createUser(email: string) {
    const id = random.randomAlphanumeric(10);

    // @ts-ignore
    const newUser = await User.create({ email, id });

    return newUser;
  }
  static async findUserByEmail(email: string) {
    // @ts-ignore
    const user = await User.findOne({ where: { email } });
    return user;
  }
  static async findUserById(userId: string) {
    // @ts-ignore
    const user = await User.findOne({ where: { id: userId } });
    return user;
  }
  static async updateAddress(address: string, userId: string) {
    const [affectedRows] = await User.update({ address }, { where: { id: userId } });
    if (affectedRows === 0) return { message: "Address update failed" };

    return { message: "Address updated successfully" };
  }
  static async updatePartialUser(userId: string, data: Partial<User>) {
    const [affectedRows] = await User.update(data, { where: { id: userId } });
    if (affectedRows === 0) return { message: "User update failed" };

    return { message: "User updated successfully" };
  }
}
User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);
