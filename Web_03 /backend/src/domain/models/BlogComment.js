import { Model, DataTypes } from 'sequelize';

class BlogComment extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            postId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'BlogPosts',
                    key: 'id'
                }
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            parentId: {
                type: DataTypes.UUID,
                references: {
                    model: 'BlogComments',
                    key: 'id'
                }
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    len: [1, 1000]
                }
            },
            status: {
                type: DataTypes.ENUM('pending', 'approved', 'rejected'),
                defaultValue: 'pending'
            },
            isEdited: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            sequelize,
            modelName: 'BlogComment',
            timestamps: true,
            paranoid: true
        });
    }

    static associate(models) {
        this.belongsTo(models.BlogPost, { as: 'post' });
        this.belongsTo(models.User, { as: 'author' });
        this.hasMany(models.BlogComment, { as: 'replies', foreignKey: 'parentId' });
        this.belongsTo(models.BlogComment, { as: 'parent', foreignKey: 'parentId' });
    }
}

export default BlogComment; 