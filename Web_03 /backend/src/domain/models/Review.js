import { Model, DataTypes } from 'sequelize';

class Review extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            productId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Products',
                    key: 'id'
                }
            },
            orderId: {
                type: DataTypes.UUID,
                references: {
                    model: 'Orders',
                    key: 'id'
                }
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5
                }
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 100]
                }
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    len: [10, 1000]
                }
            },
            images: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                defaultValue: []
            },
            isVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            isPublished: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            helpfulCount: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            reportCount: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
        }, {
            sequelize,
            modelName: 'Review',
            timestamps: true,
            paranoid: true
        });
    }

    static associate(models) {
        this.belongsTo(models.User);
        this.belongsTo(models.Product);
        this.belongsTo(models.Order);
        this.hasMany(models.ReviewReaction);
    }
}

export default Review; 