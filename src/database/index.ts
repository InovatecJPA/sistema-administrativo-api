import { Op, WhereOptions, Order } from "sequelize";
import { Request } from "express";

// Loc src/apps/Auth/models/auth
// Ainda não implementado
// const User = require("../apps/Auth/models/User");
// const Grant = require("../apps/Auth/models/grant");
// const Profile = require("../apps/Auth/models/profile");
// const ProfileGrant = require("../apps/Auth/models/profileGrant");

// /** Associations */

// Profile.belongsToMany(Grant, { through: ProfileGrant, as: "grants" });
// Grant.belongsToMany(Profile, { through: ProfileGrant, as: "profiles" });
// ProfileGrant.belongsTo(Profile);
// ProfileGrant.belongsTo(Grant);

// User.belongsTo(Profile, { as: "profilesId", foreignKey: "profiles_id" });

const db = {};

const MAX_PAGE_NUMBER = 500;

const isDate = (str: string): boolean => {
	try {
		return !isNaN(Date.parse(str));
	} catch (error) {
		return false;
	}
};

function renameKeys<T extends Record<string, any>>(
	obj: T,
	newKeys: Record<string, string>
): T {
	const keyValues = Object.keys(obj).map((key) => {
		const newKey = newKeys[key] || key;
		return { [newKey]: obj[key] };
	});
	return Object.assign({}, ...keyValues);
}

interface PaginateOptions {
	filter?: any;
	order?: any;
	include?: any;
	[key: string]: any;
}

// paginate

module.exports = db;
