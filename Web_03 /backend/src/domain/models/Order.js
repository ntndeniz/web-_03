import { Model, DataTypes } from 'sequelize';

class Order extends Model {
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
            status: {
                type: DataTypes.ENUM(
                    'pending',
                    'processing',
                    'paid',
                    'shipped',
                    'delivered',
                    'cancelled'
                ),
                defaultValue: 'pending'
            },
            totalAmount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            shippingAddress: {
                type: DataTypes.JSONB,
                allowNull: false
            },
            paymentMethod: {
                type: DataTypes.STRING,
                allowNull: false
            },
            paymentStatus: {
                type: DataTypes.ENUM('pending', 'completed', 'failed'),
                defaultValue: 'pending'
            },
            trackingNumber: {
                type: DataTypes.STRING
            },
            notes: {
                type: DataTypes.TEXT
            },
            metadata: {
                type: DataTypes.JSONB,
                defaultValue: {}
            }
        }, {
            sequelize,
            modelName: 'Order',
            timestamps: true,
            paranoid: true
        });
    }

    static associate(models) {
        this.belongsTo(models.User);
        this.hasMany(models.OrderItem);
        this.hasOne(models.Payment);
    }
}

export default Order; 