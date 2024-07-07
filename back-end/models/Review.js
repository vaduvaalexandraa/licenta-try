const {Model,DataTypes}=require('sequelize');
const sequelize=require('../database');

class Review extends Model{}

Review.init({
    idUser:{
        type:DataTypes.STRING,
        allowNull:false
    },
    idBook:{
        type:DataTypes.STRING,
        allowNull:false
    },
    review:{
        type:DataTypes.STRING,
        allowNull:false
    },
    rating:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},
{
    sequelize,
    modelName:'review',
    timestamps:false
});

module.exports=Review;