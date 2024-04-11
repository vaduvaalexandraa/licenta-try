const {Model,DataTypes}=require('sequelize');
const sequelize=require('../database');

class Imprumut extends Model{}
Imprumut.init({
    idUser:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ISBNcarte:{
        type:DataTypes.STRING,
        allowNull:false
    },
    dataImprumut:{
        type:DataTypes.DATE,
        allowNull:false
    },
    dataRestituire:{
        type:DataTypes.DATE,
        allowNull:false
    }
    }
    ,{
    sequelize,
    modelName:'borrow',
    timestamps:false
});