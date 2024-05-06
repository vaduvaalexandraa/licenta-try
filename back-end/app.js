const express = require('express');
const app = express();
const sequelize = require('./database');
const User = require('./models/User');
const Carte=require('./models/Carte');
const Autor=require('./models/Autor');
const Wishlist=require('./models/Wishlist');
const Imprumut=require('./models/Imprumut');

app.use(express.json()); 
const cors=require('cors');
app.use(cors());

sequelize.sync({force:false}).then(() => {
    console.log('Database is connected');
});

//UTILIZATOR

app.post('/users', async (req, res) => {
    await User.create(req.body)
    res.send('User is created'); 

});

app.get('/users',async (req,res)=>{
    const users=await User.findAll();
    res.send(users);
})

app.get('/users/:id',async (req,res)=>{
    const user=await User.findOne({where:{id:req.params.id}});
    res.send(user);
})

app.put('/users/:id',async (req,res)=>{
    const user=await User.findOne({where:{id:req.params.id}});
    user.phoneNumber=req.body.phoneNumber;
    await user.save();
    res.send('user phone number is updated!')
});

app.delete('/users/:id',async (req,res)=>{
    const user=await User.findOne({where:{id:req.params.id}});
    await user.destroy();
    res.send('user deleted!');});


//CARTE

app.post('/carti', async (req, res) => {
    const carti= await Carte.create(req.body)
    res.send(carti); 
});

app.get('/carti',async (req,res)=>{
    const carti=await Carte.findAll();
    res.send(carti);
})

app.get('/carti/find/:id',async (req,res)=>{
    const id = req.params.id;
    try{
        const carte = await Carte.findByPk(id);
        res.json(carte);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Something went wrong'});
    }
});

app.get('/carti/title/:titlu',async (req,res)=>{
    const carte=await Carte.findOne({where:{titlu:req.params.titlu}});
    res.send(carte);
})

app.delete('/carti/:id',async (req,res)=>{
    const carte=await Carte.findOne({where:{id:req.params.id}});
    await carte.destroy();
    res.send('book deleted!');});

app.delete('/users/:titlu',async (req,res)=>{
    const carte=await Carte.findOne({where:{titlu:req.params.titlu}});
    await carte.destroy();
    res.send('book deleted!');});
    
//AUTOR
app.post('/autori', async (req, res) => {
    const autori=await Autor.create(req.body)
    res.send(autori); 
});

app.get('/autori',async (req,res)=>{
    const autori=await Autor.findAll();
    res.send(autori);
});

app.get('/autori/id/:id',async(req,res)=>{
    const id = req.params.id;
    try{
        const autor = await Autor.findByPk(id);
        res.json(autor);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Something went wrong'});
    }
});

app.get('/autori/find/:nume&:prenume',async (req,res)=>{
    const autor=await Autor.findOne({where:{nume:req.params.nume,prenume:req.params.prenume}});
    res.send(autor);
});

app.delete('/autori/:id',async (req,res)=>{
    const autor=await Autor.findOne({where:{id:req.params.id}});
    await autor.destroy();
    res.send('author deleted!');});


//WISHLIST

app.post('/wishlist', async (req, res) => {
    const wishlist=await Wishlist.create(req.body)
    res.send(wishlist);
});

app.get('/wishlist',async (req,res)=>{
    const wishlist=await Wishlist.findAll();
    res.send(wishlist);
});

app.get('/wishlist/:idUser',async (req,res)=>{
    const wishlist=await Wishlist.findAll({where:{idUser:req.params.idUser}});
    res.send(wishlist);
});

app.get('/wishlist/:idUser/:idCarte', async (req, res) => {
    const wishlistItem = await Wishlist.findOne({
        where: { idUser: req.params.idUser, idCarte: req.params.idCarte }
    });
    res.send(wishlistItem);
});

app.delete('/wishlist/:idUser/:idCarte', async (req, res) => {
    const wishlistItem = await Wishlist.findOne({
        where: { idUser: req.params.idUser, idCarte: req.params.idCarte }
    });
    await wishlistItem.destroy();
    res.send('Book removed from wishlist!');
});


app.delete('/wishlist/:idUser&:idCarte',async (req,res)=>{
    const wishlist=await Wishlist.findOne({where:{idUser:req.params.idUser,idCarte:req.params.idCarte}});
    await wishlist.destroy();
    res.send('book deleted from wishlist!');});

//IMPRUMUT
app.post('/imprumuturi', async (req, res) => {
    await Imprumut.create(req.body)
    res.send('Imprumut is created'); 
});

app.get('/imprumuturi',async (req,res)=>{
    const imprumuturi=await Imprumut.findAll();
    res.send(imprumuturi);
});



///Login IN


const cookieParser = require('cookie-parser');
app.use(cookieParser());

const registerRouter=require('./routes/register');
const loginRouter=require('./routes/login');

app.use('/register',registerRouter);
app.use('/login',loginRouter);

const uploadMulter=require('./middleware/multerFiles');


app.post('/multifiles',uploadMulter.array('files'),(req,res)=>{
    const files=req.files;
    if(Array.isArray(files)&&files.length>0){
        res.json(files);
    }
    else{
        res.json({message:'No files uploaded!'});
    }
    
});

app.get('/uploads/find/:filename',(req,res)=>{
    const filename=req.params.filename;
    res.sendFile(__dirname+'/uploads/'+filename);
});

app.get('/uploads/:bookId', (req, res) => {
    const bookId = req.params.bookId;
    const file = __dirname + '/uploads/' + bookId;
    res.sendFile(file);
});

// app.get("/profile",validateToken, (req,res)=>{
//     res.json("Profile!");
// });

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
