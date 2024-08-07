"use strict";
import {
	Model,
	DataTypes,
	BelongsToGetAssociationMixin,
	BelongsToSetAssociationMixin,
	BelongsToCreateAssociationMixin,
} from "sequelize";
import bcryptjs from "bcryptjs";
import dbConnection from "../../../database/connection";
import Profile from "./Profile";

class User extends Model {
	declare id: string;
	declare name: string;
	declare cpf: string;
	declare email: string;
	declare birthDate: Date;
	declare phone: string;
	declare profiles_id: string; // FK
	declare isAtivo: boolean;
	declare password: string;
	declare password_hash: string;

	// Mixins para acessar o perfil relacionado
	declare getProfile: BelongsToGetAssociationMixin<Profile>;
	declare setProfile: BelongsToSetAssociationMixin<Profile, string>;
	declare createProfile: BelongsToCreateAssociationMixin<Profile>;

	public static async hashPassword(password: string): Promise<string> {
		return bcryptjs.hash(password, 10);
	}

	public async validPassword(password: string): Promise<boolean> {
		return bcryptjs.compare(password, this.password_hash);
	}
}

User.init(
	{
		id: {
			type: DataTypes.UUIDV4,
			primaryKey: true,
			allowNull: false,
			defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			defaultValue: "",
		},
		cpf: { type: DataTypes.STRING, unique: true },
		birthDate: {
			type: DataTypes.DATEONLY,
			validate: {
				isBefore: new Date().toISOString().split("T")[0], // Valida se a data é antes de hoje
			},
		},
		profiles_id: {
			type: DataTypes.UUID,
			references: { model: "profiles", key: "id" },
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: {
				name: "users_email",
				msg: "Email já existe",
			},
			validate: {
				isEmail: {
					msg: "Email inválido",
				},
			},
		},
		phone: { type: DataTypes.STRING },
		isAtivo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
		password: {
			type: DataTypes.VIRTUAL,
			defaultValue: "",
		},
		password_hash: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
			validate: {
				notEmpty: true,
			},
		},
	},
	{
		hooks: {
			beforeSave: async (user: User) => {
				if (user.password) {
					user.password_hash = await bcryptjs.hash(user.password, 10);
				}
			},
			beforeCreate: async (user: User, options) => {
				if (user.password !== undefined)
					user.password_hash = await bcryptjs.hash(user.password, 10);
			},
		},
		sequelize: dbConnection,
		modelName: "users",
		underscored: true,
	}
);

// Um usuário tem um perfil mas um perfil pode ter vários usuários
// Perfil nesse contexto vai estar ligado ao "Cargo" do usuário
User.belongsTo(Profile, {
	foreignKey: "profiles_id",
	as: "profile",
	onDelete: "NULL", // Se o perfil for deletado, o usuário não é deletado
});

export default User;
