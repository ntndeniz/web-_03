import { Model, DataTypes } from 'sequelize';

class Product extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    min: 0
                }
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0
                }
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false
            },
            images: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                defaultValue: []
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            metadata: {
                type: DataTypes.JSONB,
                defaultValue: {}
            }
        }, {
            sequelize,
            modelName: 'Product',
            timestamps: true,
            paranoid: true // Soft delete için
        });
    }

    static associate(models) {
        // İlişkiler burada tanımlanacak
        this.belongsTo(models.Category);
        this.hasMany(models.Review);
    }
}

export default Product; 