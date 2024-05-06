const {Model,DataTypes}=require('sequelize');
const sequelize=require('../database');

class Wishlist extends Model{}

Wishlist.init({
    idUser:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    idCarte:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},
{
    sequelize,
    modelName:'wishlist',
    timestamps:false
});

module.exports=Wishlist;