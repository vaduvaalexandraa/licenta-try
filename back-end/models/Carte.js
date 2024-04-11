const {Model,DataTypes}=require('sequelize');
const sequelize=require('../database');

class Carte extends Model{}
Carte.init({
    ISBN:{
        type:DataTypes.STRING,
        allowNull:false
    },
    titlu:{
        type:DataTypes.STRING,
        allowNull:false
    },
    idAutor:{
        type:DataTypes.STRING,
        allowNull:false
    },
    genLiterar:{
        type:DataTypes.STRING,
        allowNull:false
    },
    anulPublicarii:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    
    numarPagini:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    descriere:{
        type:DataTypes.STRING,
        allowNull:false
    },
    nrExemplareDisponibile:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
    ,
    imagineCarte:{
        type: DataTypes.STRING,
        allowNull: true,
        get() {
            const imagineCarte = this.getDataValue('imagineCarte');
            return imagineCarte ? imagineCarte.split(',') : [];
        },
        set(imagineCarte) {
            this.setDataValue('imagineCarte', imagineCarte.join(','));
    }
    }},
     
    {
        sequelize,
        modelName:'book',
        timestamps:false
    });

module.exports=Carte;
    