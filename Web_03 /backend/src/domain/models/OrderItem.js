import { Model, DataTypes } from 'sequelize';

class OrderItem extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            orderId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Orders',
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
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1
                }
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            metadata: {
                type: DataTypes.JSONB,
                defaultValue: {}
            }
        }, {
            sequelize,
            modelName: 'OrderItem',
            timestamps: true
        });
    }

    static associate(models) {
        this.belongsTo(models.Order);
        this.belongsTo(models.Product);
    }
}

export default OrderItem; 