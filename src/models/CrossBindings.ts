import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface CrossBindingsAttributes {
  id: number;
  createdAt: Date;
  userID: number;
  contentID: number;
  type: string;
  extra?: string;
}

export type CrossBindingsPk = "id";
export type CrossBindingsId = CrossBindings[CrossBindingsPk];
export type CrossBindingsOptionalAttributes = "id" | "createdAt" | "extra";
export type CrossBindingsCreationAttributes = Optional<CrossBindingsAttributes, CrossBindingsOptionalAttributes>;

export class CrossBindings extends Model<CrossBindingsAttributes, CrossBindingsCreationAttributes> implements CrossBindingsAttributes {
  id!: number;
  createdAt!: Date;
  userID!: number;
  contentID!: number;
  type!: string;
  extra?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof CrossBindings {
    return CrossBindings.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contentID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    extra: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'CrossBindings',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "CrossBindings_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
