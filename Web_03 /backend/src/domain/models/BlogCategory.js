import { Model, DataTypes } from 'sequelize';
import slugify from 'slugify';

class BlogCategory extends Model {
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
            parentId: {
                type: DataTypes.UUID,
                references: {
                    model: 'BlogCategories',
                    key: 'id'
                }
            },
            order: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
        }, {
            sequelize,
            modelName: 'BlogCategory',
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
        this.hasMany(models.BlogCategory, { as: 'children', foreignKey: 'parentId' });
        this.belongsTo(models.BlogCategory, { as: 'parent', foreignKey: 'parentId' });
        this.hasMany(models.BlogPost);
    }
}

export default BlogCategory; 