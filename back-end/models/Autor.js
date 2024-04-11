const {Model,DataTypes}=require('sequelize');
const sequelize=require('../database');

class Autor extends Model{}
Autor.init({
    nume:{
        type:DataTypes.STRING,
        allowNull:false
    },
    prenume:{
        type:DataTypes.STRING,
        allowNull:false
    }
    }
    ,{
    sequelize,
    modelName:'author',
    timestamps:false
});

module.exports=Autor;