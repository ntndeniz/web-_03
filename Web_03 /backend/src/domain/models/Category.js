import { Model, DataTypes } from 'sequelize';
import slugify from 'slugify';

class Category extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            slug: {
                type: DataTypes.STRING,
                unique: true
            },
            description: {
                type: DataTypes.TEXT
            },
            image: {
                type: DataTypes.STRING
            },
            parentId: {
                type: DataTypes.UUID,
                references: {
                    model: 'Categories',
                    key: 'id'
                }
            },
            order: {
                type: DataTypes.INTEGER,
                defaultValue: 0
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
            modelName: 'Category',
            timestamps: true,
            hooks: {
                beforeValidate: (category) => {
                    if (category.name) {
                        category.slug = slugify(category.name, { lower: true });
                    }
                }
            }
        });
    }

    static associate(models) {
        this.hasMany(models.Category, { as: 'children', foreignKey: 'parentId' });
        this.belongsTo(models.Category, { as: 'parent', foreignKey: 'parentId' });
        this.hasMany(models.Product);
    }
}

export default Category; 