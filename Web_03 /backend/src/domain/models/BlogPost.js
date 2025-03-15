import { Model, DataTypes } from 'sequelize';
import slugify from 'slugify';

class BlogPost extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 255]
                }
            },
            slug: {
                type: DataTypes.STRING,
                unique: true
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            excerpt: {
                type: DataTypes.TEXT,
                validate: {
                    len: [0, 500]
                }
            },
            coverImage: {
                type: DataTypes.STRING
            },
            authorId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            categoryId: {
                type: DataTypes.UUID,
                references: {
                    model: 'BlogCategories',
                    key: 'id'
                }
            },
            tags: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                defaultValue: []
            },
            status: {
                type: DataTypes.ENUM('draft', 'published', 'archived'),
                defaultValue: 'draft'
            },
            publishedAt: {
                type: DataTypes.DATE
            },
            viewCount: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            metadata: {
                type: DataTypes.JSONB,
                defaultValue: {}
            }
        }, {
            sequelize,
            modelName: 'BlogPost',
            timestamps: true,
            hooks: {
                beforeValidate: (post) => {
                    if (post.title) {
                        post.slug = slugify(post.title, { lower: true });
                    }
                    if (post.status === 'published' && !post.publishedAt) {
                        post.publishedAt = new Date();
                    }
                }
            }
        });
    }

    static associate(models) {
        this.belongsTo(models.User, { as: 'author' });
        this.belongsTo(models.BlogCategory, { as: 'category' });
        this.hasMany(models.BlogComment);
    }
}

export default BlogPost; 