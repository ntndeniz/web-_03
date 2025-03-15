import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            role: {
                type: DataTypes.ENUM('user', 'admin'),
                defaultValue: 'user'
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            lastLogin: {
                type: DataTypes.DATE
            }
        }, {
            sequelize,
            modelName: 'User',
            timestamps: true,
            hooks: {
                beforeSave: async (user) => {
                    if (user.changed('password')) {
                        user.password = await bcrypt.hash(user.password, 10);
                    }
                }
            }
        });
    }

    async validatePassword(password) {
        return bcrypt.compare(password, this.password);
    }
}

export default User; 