const express = require('express');
const app = express();
var bodyParser     =        require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
var cloudinary = require('cloudinary');


const SELECT_ONE_CANDIDATE_QUERY = 'SELECT * from ?? where id = ?';
const SELECT_ALL_DETAILS_QUERY = 'SELECT nom,prenom,scoreQCM,scoreIntell,scoreTotal from fibreOptique';
//const SELECT_ALL_CANDIDATES_QUERY = 'SELECT nom, prenom, mail from fibreOptique';
const SELECT_EVALUATED_CANDIDATES = 'SELECT nom, prenom, mail from ?? ';
const EVALUATE_CANDIDATE_QUERY = 'INSERT into ?? (nom, prenom, mail, redaction1, redaction2, redactions, discours1, discours2, discours, question1, question2, question3, questions) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) '
const CANDIDATE_EVALUATED_OR_NOT = 'SELECT COUNT(*) FROM Aymen_Rezgui where nom = '
const SELECT_ALL_QUESTIONS_QUERY_1 = 'SELECT * from intelligence'
const SELECT_ALL_QUESTIONS_QUERY_2 = 'SELECT * from qcm'
const SELECT_ALL_QUESTIONS_QUERY_3 = 'SELECT * from redaction'
const SELECT_ALL_QUESTIONS_QUERY_4 = 'SELECT * from reflexes'
const SELECT_ALL_CANDIDATES_QUERY_1 = 'SELECT * from fibreOptique'
const SELECT_ALL_CANDIDATES_QUERY_2 = 'SELECT * from informatique'
const SELECT_ALL_CANDIDATES_QUERY_3 = 'SELECT * from mobile'
const SELECT_ONE_QUESTION_QUERY = 'SELECT * FROM ? where id = ?'

cloudinary.config({ 
  cloud_name: 'dwsk5ycwd', 
  api_key: '676281381912164', 
  api_secret: '4SNPMjSxFg1ihdLL8d4PvOSYVRs' 
});

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'Reponses'
});

const connection2 = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'Admin'
});

const connection3 = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'Questions'
});
const connection4 = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'candidats'
})
const connection5 = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '',
  database : 'Emotional_Images'
})

connection.connect(err => {
  if(err){
    return err ;
  }
});

connection2.connect(err => {
  if(err){
    return err ;
  }
});

connection3.connect(err => {
  if(err){
    return err ;
  }
});
connection4.connect(err => {
  if(err){
    return err ;
  }
});
connection5.connect(err => {
  if(err){
    return err ;
  }
});

app.use(cors());
/*app.get('/api/customers', (req, res) => {
  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Brad', lastName: 'Traversy'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];

  res.json(customers);
});*/
app.get('/', (req,res) => {
  res.send('Got to ...');
});
app.get('/:admin/reponses', (req,res) => {
  let total = []
  connection.query(SELECT_ALL_CANDIDATES_QUERY_1, ( err, result1 ) => {
    if(err){
      return res.send(err);
    }
    else {
      result1.map((element) => {
        element.field = 'fibreOptique'
        total.push(element);
      })
        connection.query(SELECT_ALL_CANDIDATES_QUERY_2, (err,result2) => {
          if(err){
            return res.send(err)
          }else{
            result2.map((element) => {
              element.field = 'informatique'
              total.push(element);
            })
            connection.query(SELECT_ALL_CANDIDATES_QUERY_3, (err,result3) => {
              if(err){
                return res.send(err)
              }
              else{
                result3.map((element) => {
                  element.field = 'mobile'
                  total.push(element)
                })
                index(0);
          function index(i){
            if(i<=total.length-1){
             
                let params = [req.params.admin,total[i].nom,total[i].prenom]
              connection2.query('select count(*) from ?? where nom = ? and prenom = ?',params,(err,result2) => {
                if(err){
                  return res.send(err)
                }
                else{
                  console.log('result is ...', result2)
                  for(let key in result2[0]){
                    count = parseInt((result2[0])[key])
                    if(count == 0){
                        total[i].evaluated = false;
                        
                      }else{
                        total[i].evaluated = true;
                        
                      }
                    i=i+1
                    index(i);
                  }
                }
              })
              
            }else{
              return res.json(total);
            }
          }
                
              }
            })
          }
        })
    }
  });
});
app.get('/:admin/reponses/:field/:id', (req,res) => {
  //console.log('Id est', req.params.id);
  let params = [req.params.field,req.params.id]
  connection.query(SELECT_ONE_CANDIDATE_QUERY, params, ( err, result ) => {
    if(err){
      return res.send(err);
    }
    else {
      let tablename = result[0].nom + '_' + result[0].prenom;
      let emoImage = false;
      connection5.query('show tables', (err,result5) => {
        if(err){
          return res.send(err);
        }else{
          indexos(0);
          function indexos(i){
            if(i<= result5.length -1){
              if(result5[i].Tables_in_Emotional_Images == tablename){
                emoImage = true;
              }
              i++;
              indexos(i);
            }else{
              if(emoImage){
                connection5.query('select * from ??', tablename, (err,result1) => {
                  if(err){
                    return res.send(err);
                  }else{
                    result[0].emotions = result1;
                    result[0].evaluated = 'false';
                    let params = [req.params.admin,req.params.id]
                    connection2.query(SELECT_EVALUATED_CANDIDATES ,params, (err2,result2) => {
                      if(err2){
                        return res.send(err2);
                      }else{
                        
                        
                          
                          index(0);
                          function index(i){
                            if(i <= result2.length -1){
                              if(result[0].nom === result2[i].nom && result[0].prenom === result2[i].prenom && result[0].evaluated ==='false'){
                                result[0].evaluated = 'true'
                              }
                              i++
                              index(i);
                            }else{
                              return res.json(result)
                            }
                          }
                          
                        
                        
                      }
                })
                  }
                })
              }else{
                result[0].emotions = false;
                    result[0].evaluated = 'false';
                    let params = [req.params.admin,req.params.id]
                    connection2.query(SELECT_EVALUATED_CANDIDATES ,params, (err2,result2) => {
                      if(err2){
                        return res.send(err2);
                      }else{
                        
                        
                          
                          index(0);
                          function index(i){
                            if(i <= result2.length -1){
                              if(result[0].nom === result2[i].nom && result[0].prenom === result2[i].prenom && result[0].evaluated ==='false'){
                                result[0].evaluated = 'true'
                              }
                              i++
                              index(i);
                            }else{
                              return res.json(result)
                            }
                          }
                          
                        
                        
                      }
                })
              }
            }
          }
          result5.map((a) => {
            if(a.Tables_in_Emotional_Images == tablename){
              emoImage = true;
            }else{

            }
          })
          
        }
      })
      
    }
  });
});
app.post('/:admin/reponses/submit', (req,res) => {
  
    console.log('here fetched...');
    //console.log('mail is ...', req.body.mail);
    //res.end("yes");
    
    let params = [req.params.admin,req.body.nom,req.body.prenom,req.body.mail,req.body.redaction1,req.body.redaction2,req.body.redactions,req.body.discours1,req.body.discours2,req.body.discours,req.body.question1,req.body.question2,req.body.question3,req.body.questions];
    let queries =
    connection2.query(EVALUATE_CANDIDATE_QUERY,params,(err,result) => {
      if(err){
        return res.send(err);
      }
      else{
        res.end("yes");
      }
    })
  
  //connection2.query()

});
app.get('/questions/intelligence', (req,res) => {
  connection3.query(SELECT_ALL_QUESTIONS_QUERY_1, (err,result) => {
    if(err){
      return res.send(err);
    }
    else {
      return res.json(result);
    }
  })
});
app.get('/questions/qcm', (req,res) => {
  connection3.query(SELECT_ALL_QUESTIONS_QUERY_2, (err,result) => {
    if(err){
      return res.send(err);
    }
    else {
      return res.json(result);
    }
  })
});
app.get('/questions/redaction', (req,res) => {
  connection3.query(SELECT_ALL_QUESTIONS_QUERY_3, (err,result) => {
    if(err){
      return res.send(err);
    }
    else {
      return res.json(result);
    }
  })
});
app.get('/questions/reflexes', (req,res) => {
  connection3.query(SELECT_ALL_QUESTIONS_QUERY_4, (err,result) => {
    if(err){
      return res.send(err);
    }
    else {
      return res.json(result);
    }
  })
});
app.get('/candidates/fibre-optique', (req,res) => {
  connection.query(SELECT_ALL_CANDIDATES_QUERY_1, (err,result) => {
    if(err){
      return res.send(err);
    }else{
      let resultmap = [];
      connection2.query('show tables',(err,result1) =>{
        if(err){
          return res.send(err);
        }else{
          
          
          result1.map((a) => {
            resultmap.push(a.Tables_in_Admin);
          })
          index(0,0,0);
          function index(i,j,count){
            if(i<=result.length-1){
              if(j<=resultmap.length-1){
                let params = [resultmap[j],result[i].nom,result[i].prenom];
              connection2.query('select count(*) from ?? where nom = ? and prenom = ?', params ,(err,result2) => {
                if(err){
                  return res.send(err)
                }
                else{
                  console.log('abcd Rresult is ...', result2)
                  for(let key in result2[0]){
                    count = count + parseInt((result2[0])[key])
                    j=j+1;
                    index(i,j,count)
                  }
                }
              })
              }else{
                if(count == 0){
                  result[i].evaluated = false;
                  
                }else{
                  result[i].evaluated = true;
                  
                }
                i=i+1
                index(i,0,0);
              }
            }else{
              return res.json(result);
            }
          }
          
          
            
            //console.log(i,j);
            
          
          
          
         
        }
      })
      
    }
  })
});
app.get('/candidates/informatique', (req,res) => {
  connection.query(SELECT_ALL_CANDIDATES_QUERY_2, (err,result) => {
    if(err){
      return res.send(err);
    }else{
      let resultmap = [];
      connection2.query('show tables',(err,result1) =>{
        if(err){
          return res.send(err);
        }else{
          result1.map((a) => {
            resultmap.push(a.Tables_in_Admin);
          })
          index(0,0,0);
          function index(i,j,count){
            if(i<=result.length-1){
              if(j<=resultmap.length-1){
                let params = [resultmap[j],result[i].nom,result[i].prenom];
              connection2.query('select count(*) from ?? where nom = ? and prenom = ?', params ,(err,result2) => {
                if(err){
                  return res.send(err)
                }
                else{
                  console.log('abcd Rresult is ...', result2)
                  for(let key in result2[0]){
                    count = count + parseInt((result2[0])[key])
                    j=j+1;
                    index(i,j,count)
                  }
                }
              })
              }else{
                if(count == 0){
                  result[i].evaluated = false;
                  
                }else{
                  result[i].evaluated = true;
                  
                }
                i=i+1
                index(i,0,0);
              }
            }else{
              return res.json(result);
            }
          }
          
          
            
            //console.log(i,j);
            
          
          
          
         
        }
      })
    }
  })
});
app.get('/candidates/mobile', (req,res) => {
  connection.query(SELECT_ALL_CANDIDATES_QUERY_3, (err,result) => {
    if(err){
      return res.send(err);
    }else{
      let resultmap = [];
      connection2.query('show tables',(err,result1) =>{
        if(err){
          return res.send(err);
        }else{
          let j = 0
          let i = 0
          result1.map((a) => {
            resultmap.push(a.Tables_in_Admin);
            j = j+1
          })
          
          resultmap.map((element) => {
            result.map((candidate) => {
              //let evaluated = false;
              let params2 = [element,candidate.nom,candidate.prenom]
              connection2.query('select count (*) from ?? where nom = ? and prenom = ? ', params2, (err,result3) => {
                if(err){
                  return res.send(err);
                }else{
                  for(let key in result3[0]){
                    if(parseInt((result3[0])[key]) != 0){
                      candidate.evaluated = true
                      i = i+1;
                      if(i == j){

                        return res.json(result)
                      }
                    }else{
                      candidate.evaluated = false
                      i = i+1;
                      if(i == j){

                        return res.json(result)
                      }
                    }
                  }
                  
                  //return res.json(candidate);
                  
                }
              })
            })
            
            //console.log(i,j);
            
          })
          
          
         
        }
      })
    }
  })
});
app.get('/admins', (req,res) => {
  let resultmap = [];
  connection2.query('show tables',(err,result) => {
    if(err){
      return res.send(err);
    }else{
      result.map((a) => {
        resultmap.push(a.Tables_in_Admin);
      })
      
        //console.log(a)
      
     
      return res.json(resultmap);
      //return res.json(result);
    }
  })
});
app.get('/admins/:admin',(req,res) => {
  //let Tata = [req.param.Admin];
  console.log('req is ...', req.params.admin);
  //let concat = SELECT_FROM_ONE_ADMIN + ''
  connection2.query('SELECT * from ?? ' ,req.params.admin,(err,result) => {
    if(err){
      return res.send(err);
    }
    else{
      console.log(result)
      return res.json(result);
    }
  })
})
app.get('/questions/:domaine/:id', (req,res) => {
  let params = [req.params.domaine,req.params.id]
  connection3.query('SELECT * from ?? where id = ?', params,(err,result) => {
    if(err){
      return res.send(err);
    }else{
      return res.json(result);
    }
  })
})
app.get('/candidates/:domaine/:id', (req,res) => {
  console.log('HERE...',req.params.domaine)
  let params = [req.params.domaine,req.params.id]
  connection.query('SELECT * from ?? where id = ?',  params , (err,result) => {
    
        if(err){
          return res.send(err);
        }else{
          let candidate = result[0]
          connection2.query('show tables',(err,result1) => {
            if(err){
              return res.send(err);
            }else{
              let i = 0
              let count = 0
              let rstable = []
              let data = []
              result1.map((rs1) => {
                rstable= [rs1.Tables_in_Admin,...rstable]
              }
              
            );
            console.log(rstable)
            console.log(rstable.length);
            //return res.json('hhhh')
            queries(0)
            console.log(result[0]);
              /*connection2.query('select count(*) from '+rstable[1]+' where nom = ?',result[0].nom, (err,result) => {
                if(err){
                  return res.send(err);
                }else{
                  return res.json(result);
                }
              })*/
              function queries(i){
                if(i<=rstable.length-1){
                  let params = [rstable[i],result[0].nom,result[0].prenom]
                  connection2.query('select count(*) from ?? where nom = ? and prenom = ?',params,(err,result5) => {
                    if(err){
                      return res.send(err)
                    }
                    else{
                      console.log('result is ...', result)
                      for(let key in result5[0]){
                        if(parseInt((result5[0])[key])!= 0){
                          count = count + parseInt((result5[0])[key])
                          connection2.query('select * from ?? where nom = ? and prenom = ?',params, (err, result3) => {
                            if(err){
                              return res.send(err);
                            }else{
                              data = [
                                {
                                  admin : rstable[i] ,
                                  count : result5[0][key],
                                  data : result3[0]
                                },...data]
                                console.log('data is ...',data);
                                i= i+1;
                                queries(i);
                            }
                          })
                          
                        }else{
                          i=i+1;
                          queries(i);
                        }
                      }
                    }
                  })
                }else{
                  if(count == 0){
                    return res.json({
                      candidate : candidate,
                      count : 0,
                      data : ''
                    })
                  }else{
                    return res.json({
                      candidate : candidate,
                      count : count,
                      data : data
                    })
                  }
                }
              }
              
              
            
          }})
        }
      })
  
})
app.get('/questions/qcm/:id1/:id2/:id3/:id4', (req,res) => {
  let params = [req.params.id1,req.params.id2, req.params.id3, req.params.id4]
  connection3.query('SELECT * from qcm where id = ? or id = ? or id = ? or id = ?', params,(err,result) => {
    if(err){
      return res.send(err);
    }else{
      return res.json(result);
    }
  })
})
app.get('/questions/intel/:id1/:id2/:id3', (req,res) => {
  let params = [req.params.id1,req.params.id2, req.params.id3]
  connection3.query('SELECT * from intelligence where id = ? or id = ? or id = ? ', params,(err,result) => {
    if(err){
      return res.send(err);
    }else{
      return res.json(result);
    }
  })
})
app.get('/questions/redaction/:id1/:id2', (req,res) => {
  let params = [req.params.id1,req.params.id2]
  connection3.query('SELECT * from redaction where id = ? or id = ?  ', params,(err,result) => {
    if(err){
      return res.send(err);
    }else{
      return res.json(result);
    }
  })
})
app.get('/questions/reflexes/:id1/:id2', (req,res) => {
  let params = [req.params.id1,req.params.id2]
  connection3.query('SELECT * from reflexes where id = ? or id = ?  ', params,(err,result) => {
    if(err){
      return res.send(err);
    }else{
      return res.json(result);
    }
  })
})
app.delete('/questions/:field/:id',(req,res) => {
  let params = [req.params.field,req.params.id]
  connection3.query( 'delete from ?? where id = ? ',params,(err,result) => {
    if(err){
      return res.send(err);
    }else{
      console.log('hata',result)
      return res.json({
        field : req.params.field,
        id : req.params.id,
        state : 'OK'
      })
    }
  })
} )
app.delete('/admins/:admin',(req,res) => {
  connection2.query('drop table ?? ', req.params.admin, (err,result) => {
    if(err){
      return res.send(err);
    }else{
      let ccbb = {
        state : "OK",
        admin : req.params.admin
      }
      return res.json(ccbb);
    }
  } )
})
app.post('/admins',(req,res) => {
  let fullName = req.body.nom+'_'+req.body.prenom
  console.log(fullName);
  longestQuesryEver = 'CREATE TABLE `Admin`.?? ( `id` INT NOT NULL AUTO_INCREMENT , `nom` TEXT NOT NULL , `prenom` TEXT NOT NULL , `mail` TEXT NOT NULL , `redaction1` VARCHAR(11) NOT NULL , `redaction2` VARCHAR(11) NOT NULL , `redactions` VARCHAR(11) NOT NULL , `discours1` VARCHAR(11) NOT NULL , `discours2` VARCHAR(11) NOT NULL , `discours` VARCHAR(11) NOT NULL , `question1` VARCHAR(11) NOT NULL , `question2` VARCHAR(11) NOT NULL , `question3` VARCHAR(11) NOT NULL , `questions` VARCHAR(11) NOT NULL , PRIMARY KEY (`id`))'
  connection2.query(longestQuesryEver,fullName,(err,result) => {
    if(err){
      return res.send(err)
    }else{
      return res.json({
        Admin : fullName
      })
    }
  })
})
app.post('/questions',(req,res) => {
  if(req.body.type == 'qcm'){
    let params=[req.body.domaine,req.body.question,req.body.a,req.body.b,req.body.c,req.body.d,req.body.e,req.body.f,req.body.g,req.body.repcorrecte,parseInt(req.body.niveau)]
    connection3.query('insert into qcm(domaine,question,a,b,c,d,e,f,g,repcorrecte,niveau) values (?,?,?,?,?,?,?,?,?,?,?)',params,(err,result) => {
      if(err){
        return res.send(err)
      }else{
        return res.json({
          id : result.inserId,
          domaine : req.body.domaine,
          field : 'qcm',
          niveau : parseInt(req.body.niveau),
          question : req.body.question
        })
      }
    })
  }if(req.body.type == 'redaction'){
    let params=[req.body.domaine,req.body.question,parseInt(req.body.niveau)]
    connection3.query('insert into redaction(domaine,question,niveau) values (?,?,?)',params,(err,result) => {
      if(err){
        return res.send(err)
      }else{
        return res.json({
          id : result.inserId,
          domaine : req.body.domaine,
          field : 'redaction',
          niveau : parseInt(req.body.niveau),
          question : req.body.question
        })
      }
    })
  }if(req.body.type == 'reflexes'){
    let params=[req.body.question,parseInt(req.body.niveau)]
    connection3.query('insert into reflexes(question,niveau) values (?,?)',params,(err,result) => {
      if(err){
        return res.send(err)
      }else{
        return res.json({
          id : result.inserId,
          domaine : 'tous les domaines',
          field : 'reflexes',
          niveau : parseInt(req.body.niveau),
          question : req.body.question
        })
      }
    })
  }
})
app.post('/login',(req,res) => {
  connection.query('select count(*) from Admin_List where email = ?',req.body.email, (err,result) => {
    if(err){
      return res.send(err)
    }else{
      for(key in result[0]){
        if(parseInt((result[0])[key]) == 0){
          return res.json({
            valid : false,
            error : 'Invalid Email'
          })
        }else{
          connection.query('select password , nom, prenom from Admin_List where email = ?' ,req.body.email, (err,result1) => {
            if(err){
              return res.send(err)
            }else{
              console.log(result1, result1[0]);
              for (key in result1[0]){
                console.log((result1[0])[key])
                if(req.body.password != (result1[0])[key]){
                  return res.json({
                    valid : false,
                    error : 'Invalid Password'
                  })
                }else{
                  if(req.body.email == 'Jamel.hassine@intercom-technologies.fr'){
                    return res.json({
                      valid : true,
                      username : result1[0].nom + '_' + result1[0].prenom,
                      superadmin : true
                    })
                  }
                  return res.json({
                    valid : true,
                    username : result1[0].nom + '_' + result1[0].prenom,
                    superadmin : false
                  })
                }
              }
              
            }
          })
        }
      }
      
    }
  })
})
app.delete('/candidates/:field/:id', (req,res) => {
  let OUTPUT= `
    <h1>Bonne Journée ! </h1><br>
    <p>Aprés passer votre entretien avec Sesame, ,  </p><br>
    <p>Nous vous adressons afin de vous informer que vous n'étes pas selectionné parmi ceux </p> 
    <p>acceptés pour un entretien</p>
    <p>Nous allons garder votre contact pour des futurs opportunités</p>
    <h3>On vous souhaite que du meilleur</h3><br>
    <h3>Pour plus d'information :</h3>
    <p>CONTACT</p>
  `
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'ousstesterfreetester@gmail.com', // generated ethereal user
        pass: 'oussFreeman@123' // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false,
    }
  });
  

  let params = [req.params.field, req.params.id];
  connection.query('select nom , prenom, mail ,tel ,residence, experience, scoreTotal from ?? where id = ?', params, (err, result) => {
    if (err){
      return res.send(err)
    }else{
      let params2=[result[0].nom,result[0].prenom,result[0].mail,req.params.field,result[0].residence,result[0].experience,result[0].scoreTotal]
      connection4.query('insert into candidats_refuse(nom,prenom,mail,filiere,residence,experience,ScoreTotal,date) values(?,?,?,?,?,?,?,now())',params2, (err,result1) => {
        if(err){
          return res.send(err)
        }else{
          let params3 = [req.params.field,result[0].nom,result[0].prenom,result[0].mail]
         connection.query('delete from ?? where nom = ? and prenom = ? and mail = ?', params3, (err,result2) => {
           if(err){
             return res.send(err)
           }else{
            connection2.query('show tables',(err,result3) => {
              if(err){
                return res.send(err)
              }else{
                connection5.query('show tables',(err, result4) => {
                  if(err){
                    return res.send(err);
                  }else{
                    let resultmap = []
                    result4.map((a) => {
                      resultmap.push(a.Tables_in_Emotional_Images);
                    });
                    resultmap.map((b) => {
                      if((result[0].nom + '_' + result[0].prenom) == b ){
                        connection5.query('SELECT id FROM ?? ', b, (err,resultImg) => {
                          if(err){
                            return res.send(err);
                          }else{
                            deleteImage(0);
                            function deleteImage(i){
                              if(i <= resultImg.length -1){
                                cloudinary.v2.uploader.destroy(resultImg[i].id, (error, resultata) => {
                                  if(error){
                                    return res.send(error)
                                  }else{
                                    console.log('HHHXD',resultata);
                                  }
                                  i++
                                  deleteImage(i)
                                });
                              }else{
                                connection5.query('drop table ??', b, (err, result5) => {
                                  if(err){
                                    return res.send(err);
                                  }else{
                                    let resultmap2 = []
                                    result3.map((a) => {
                                      resultmap2.push(a.Tables_in_Admin);
                                      
                                    });
                                    index(0);
                                    function index(i){
                                      if(i<=resultmap2.length -1){
                                        let params4 = [resultmap2[i],result[0].nom, result[0].prenom,result[0].mail]
                                        connection2.query('delete from ?? where nom = ? and prenom = ? and mail = ?', params4, (err,result6) => {
                                          if(err){
                                            return res.send(err)
                                          }else{
                                            i++;
                                            index(i)
                                          }
                                        })
                                      }else{
                                        let mailOptions = {
                                          from: '"NodeMailer Contact" <ousstesterfreetester@gmail.com>', // sender address
                                          to: result[0].mail , // list of receivers
                                          subject: 'Resultat de Entretien', // Subject line
                                          text: 'Monsieur ' + result[0].nom + result[0].prenom , // plain text body
                                          html: OUTPUT // html body
                                      };
                                      transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            console.log(error);
                                            return res.json({
                                              state : 'ERROR',
                                              message : error
                                            })
                                        }
                                        console.log('Message sent: %s', info.messageId);
                                        // Preview only available when sending through an Ethereal account
                                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                    
                                        return res.json({
                                          state : 'SUCCESS',
                                          message : 'Message successfully sent !!'
                                        });
                                        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                                        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                                    });
                                      
                                      }
                                    }
                                  }
                                });
                              }
                            }
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
           }
         })
        }
      })
    }
  })
})
app.delete('/candidates/:field/:id/accept', (req,res) => {
  let OUTPUT= `
  <h1>Félicitations ! </h1><br>
  <p>Aprés passer votre entretien ave notre Bot, Vous étes acceptés pour un rendez-vous à notre adresse</p><br>
  <p>Contacter notre RH afin de spécifier votre prochaine date de Rendez-vous...</p>
  <p>A très bientôt !</p>
  <h3>Adresse Intercom :</h3><br>
  <a href='https://www.google.com/maps/place/Intercom+Technologies/@36.8938043,10.1854673,15z/data=!4m2!3m1!1s0x0:0x38157ee421c59d6e?sa=X&ved=2ahUKEwjzvZDrp4PdAhUnIpoKHcgEAvAQ_BIwC3oECAYQCw'>Notre Local</a>
  <h3>Pour plus d'information :</h3>
  <a href='http://www.intercom-technologies.fr/contact/'>CONTACT</a>
  `
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'ousstesterfreetester@gmail.com', // generated ethereal user
        pass: 'oussFreeman@123' // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false,
    }
  });
  

  let params = [req.params.field, req.params.id];
  connection.query('select nom , prenom, mail ,tel ,residence, experience, scoreTotal from ?? where id = ?', params, (err, result) => {
    if (err){
      return res.send(err)
    }else{
      let params2=[result[0].nom,result[0].prenom,result[0].mail,req.params.field,result[0].residence,result[0].experience,result[0].scoreTotal]
      connection4.query('insert into candidats_accept(nom,prenom,mail,filiere,residence,experience,ScoreTotal,date) values(?,?,?,?,?,?,?,now())',params2, (err,result1) => {
        if(err){
          return res.send(err)
        }else{
          let params3 = [req.params.field,result[0].nom,result[0].prenom,result[0].mail]
         connection.query('delete from ?? where nom = ? and prenom = ? and mail = ?', params3, (err,result2) => {
           if(err){
             return res.send(err)
           }else{
            connection2.query('show tables',(err,result3) => {
              if(err){
                return res.send(err)
              }else{
                connection5.query('show tables',(err, result4) => {
                  if(err){
                    return res.send(err);
                  }else{
                    let resultmap = []
                    result4.map((a) => {
                      resultmap.push(a.Tables_in_Emotional_Images);
                    });
                    resultmap.map((b) => {
                      if((result[0].nom + '_' + result[0].prenom) == b ){
                        connection5.query('SELECT id FROM ?? ', b, (err,resultImg) => {
                          if(err){
                            return res.send(err);
                          }else{
                            deleteImage(0);
                            function deleteImage(i){
                              if(i <= resultImg.length -1){
                                cloudinary.v2.uploader.destroy(resultImg[i].id, (error, resultata) => {
                                  if(error){
                                    return res.send(error)
                                  }else{
                                    console.log('HHHXD',resultata);
                                  }
                                  i++
                                  deleteImage(i)
                                });
                              }else{
                                connection5.query('drop table ??', b, (err, result5) => {
                                  if(err){
                                    return res.send(err);
                                  }else{
                                    let resultmap2 = []
                                    result3.map((a) => {
                                      resultmap2.push(a.Tables_in_Admin);
                                      
                                    });
                                    index(0);
                                    function index(i){
                                      if(i<=resultmap2.length -1){
                                        let params4 = [resultmap2[i],result[0].nom, result[0].prenom,result[0].mail]
                                        connection2.query('delete from ?? where nom = ? and prenom = ? and mail = ?', params4, (err,result6) => {
                                          if(err){
                                            return res.send(err)
                                          }else{
                                            i++;
                                            index(i)
                                          }
                                        })
                                      }else{
                                        let mailOptions = {
                                          from: '"NodeMailer Contact" <ousstesterfreetester@gmail.com>', // sender address
                                          to: result[0].mail , // list of receivers
                                          subject: 'Resultat de Entretien', // Subject line
                                          text: 'Monsieur ' + result[0].nom + result[0].prenom , // plain text body
                                          html: OUTPUT // html body
                                      };
                                      transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            console.log(error);
                                            return res.json({
                                              state : 'ERROR',
                                              message : error
                                            })
                                        }
                                        console.log('Message sent: %s', info.messageId);
                                        // Preview only available when sending through an Ethereal account
                                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                    
                                        return res.json({
                                          state : 'SUCCESS',
                                          message : 'Message successfully sent !!'
                                        });
                                        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                                        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                                    });
                                      
                                      }
                                    }
                                  }
                                });
                              }
                            }
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
           }
         })
        }
      })
    }
  })
})
app.post('/send',(req,res) => {

  const OUTPUT = `
        <h1>Félicitations ! </h1><br>
        <p>Aprés passer votre entretien ave notre Bot, Vous étes acceptés pour un rendez-vous à notre adresse</p><br>
        <p>Regoignez -nous donc à la date DATE...</p>
        <p>A très bientôt !</p>
        <h3>Adresse Intercom :</h3><br>
        <p>ADRESSE</p>
        <h3>Pour plus d'information :</h3>
        <p>CONTACT</p>
`

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'ousstesterfreetester@gmail.com', // generated ethereal user
        pass: 'oussFreeman@123' // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false,
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"NodeMailer Contact" <ousstesterfreetester@gmail.com>', // sender address
    to: 'seriousoussama@gmail.com , frijioussama@gmail.com', // list of receivers
    subject: 'Resultat de Entretien', // Subject line
    text: 'Bonjour,', // plain text body
    html: OUTPUT // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    return res.json({
      state : 'SUCCESS',
      message : 'Message successfully sent !!'
    });
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});
})
app.get('/ghariba', (req,res) => {
  connection5.query('select * from `farid_el atrash` ', (err,result) => {
    if(err){
      return res.send(err);
    }else{
      return res.json(result);
    }
  } );
})
const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
