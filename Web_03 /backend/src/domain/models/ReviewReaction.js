import { Model, DataTypes } from 'sequelize';

class ReviewReaction extends Model {
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
            reviewId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Reviews',
                    key: 'id'
                }
            },
            type: {
                type: DataTypes.ENUM('helpful', 'report'),
                allowNull: false
            }
        }, {
            sequelize,
            modelName: 'ReviewReaction',
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ['userId', 'reviewId', 'type']
                }
            ]
        });
    }

    static associate(models) {
        this.belongsTo(models.User);
        this.belongsTo(models.Review);
    }
}

export default ReviewReaction; 