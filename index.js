const express = require("express");
const data = require('./employees.json');

const app = express();

//yup user schema
//const ValidationError = require('yup');
const registerUserSchema = require("./register-user-schema");


app.use(express.json())

//Routes
//1. GET http://localhost:8000/api/employees
//2. GET http://localhost:8000/api/employees?page=1
//5. GET http://localhost:8000/api/employees?user=true
//7. GET http://localhost:8000/api/employees?badges=black
app.get("/api/employees/", (req,res) => {
    console.log(`someone made a ${req.method} to ${req.url}`);
    const page = req.query?.page
    const user = req.query?.user
    const badges = req.query?.badges
    //console.log(page)
    //console.log(user)
    if(page){
        console.log("---page---")
        if(page == 0 || page == null){
            res.json({data})
        }
        else if(page > 3){
            return res.json({data: "There are no more employess"})
        }
        else{
            return res.json({data:data.slice((2*(+page-1)), (2*(+page-1))+2)})
        }
    }
    
    else if(user){
        console.log("---user---")
        if(user === 'false'){
            let privileges = data.filter(item => item.privileges == 'admin')
            return res.json({data: privileges})
        }
        let privileges = data.filter(item => item.privileges == 'user')
        return res.json({data: privileges})
    /* if(user == false){
        let privileges = data.filter(item => item.privileges == 'admin')
        res.json({data: privileges})
    } */
    }

    else if(badges){
        console.log("---badges---")
        let blacks = data.filter(item => item.badges.includes('black') )
        return res.json({data: blacks})
    }


    else {
        console.log("---data---")
        return res.json({data})
    }
})

//4. GET http://localhost:8000/api/employees/oldest
app.get("/api/employees/oldest", (req,res) => {
    console.log(`someone made a ${req.method} to ${req.url}`);
    let listaEdadOrdenada =  data.sort((x, y) => x.age < y.age ? 1 : (x.age > y.age) ? -1 : 0)
                       .map( item => item)
    //console.log(listaEdadOrdenada)
    return res.json({data:listaEdadOrdenada[0]})
})

//6. POST http://localhost:8000/api/employees
app.post("/api/employees", (req,res) =>{
    console.log(`someone made a ${req.method} to ${req.url}`);
    const { body } = req;
    //console.log(body)

  try {
    const newUser = registerUserSchema.validateSync(body, { abortEarly: false, stripUnknown: true });
    data.push(newUser)
    return res.json({ message: 'Success', data });

  } catch (e) {
    const error = e.inner;
    const messages = error.map(item => item.errors)
    return res.status(400).json({ errors: messages, code: "bad_request" });
  }

})

//8. GET http://localhost:8000/api/employees/NAME
app.get("/api/employees/:NAME", (req,res) => {
    console.log(`someone made a ${req.method} to ${req.url}`);
    let name = req.params.NAME
    console.log(name)
    try{
        let user = data.filter(item => item.name == name)
        if(user.length > 0){
            return res.json({data:user})
        }
        return res.status(404).json({ code: "not_found" });

    } catch (e){
        return res.status(400).json({ errors: e, code: "bad_request" });
    }
    
})


//not found
app.use((req,res,next) => {
    console.log(`someone made a ${req.method} to ${req.url}`);
    return res.status(404).json({message: "route not found"})
})

// port listen

app.listen(8000, ()=>{
    console.log('Server running on http://localhost:8000')
})