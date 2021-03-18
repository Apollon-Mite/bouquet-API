const {Seller} = require('../models');
const bcrypt = require('bcrypt');
const validator = require('email-validator');
const jsonwebtoken = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET;
// const { Op } = require('sequelize');

const sellerController = {
    sellerHandleLoginForm: async (request, response) => {
        try {
            // on cherche à identifier le seller à partir de son email
            // we are trying to identify a seller from his password
            const email = request.body.email;

            if (!validator.validate(email)) {
                // the email given has not valid format 
                return response.status(403).json('Le format de l\'email est incorrect'); 
            }

            const seller = await Seller.findOne({
                where: { 
                    email
                },
            })
                
            // if no seller found with this email => error
            if (!seller) {
                return response.status(403).json('Email ou mot de passe incorrect')
            }
  
            // the seller with this email exists, let's compare received password with the hashed one in database
            
            // bcrypt can check if 2 passwords are the same, the password entered by user and the one in database 
            const validPwd = bcrypt.compareSync(request.body.password, seller.dataValues.password);

            if (!validPwd) {
                // password is not correct, we send an error
                return response.status(403).json('Email ou mot de passe incorrect')
            }

            //const { password, ...sellerData} = seller.dataValues; // like this, we remove password from object that we'll send because it is sensitive data
            
            // this seller exists and identified himself, we send him his data (witout password)
            const updatedSeller = await Seller.findOne({
                where: { 
                    email
                },
                attributes: { exclude: ['password'] } // we don't want the password to be seen in the object we will send
      
            })

            const jwtContent = { userId: updatedSeller.id, role: "seller" };
            const jwtOptions = { 
              algorithm: 'HS256', 
              expiresIn: '3h' 
            };
            console.log('<< 200', updatedSeller.email);
            response.json({ 
              logged: true, 
              role: "seller",
              user: updatedSeller,
              token: jsonwebtoken.sign(jwtContent, jwtSecret, jwtOptions),
            });

            
            //response.status(200).json(updatedSeller);
            
        } catch (error) {
          response.status(500).json(error.toString())
        }

    },


   sellerHandleSignupForm: async (request, response) => {
    try {

      const {gender, email, password, passwordConfirm, lastname, firstname, phone_number, street_name, street_number, city, zipcode, picture_url, siret, shop_name, shop_presentation} = request.body;

      if (!gender || !email || !password || !passwordConfirm || !lastname || !firstname || !phone_number || !street_name || !street_number || !city || !zipcode || !picture_url || !siret || !shop_name) {
        return response.status(403).json('Vous n\'avez pas rempli tous les champs');  
      }
      if (!shop_presentation) { // seller can add no shop_presentation
        const shop_presentation = "";
      }
        //on checke si un utilisateur existe déjà avec cet email
        const seller = await Seller.findOne({
            where: {
                email: email
            }
        });

        if (seller) {
            //il y a déjà un utilisateur avec cet email, on envoie une erreur
            // there is already a seller with this email  
            return response.status(403).json('Un compte existe déjà avec cet email, veuillez réessayer avec un autre email');
        }
        //on checke que l'email a un format valide
        if (!validator.validate(email)) {
            // the email given has not valid format 
            return response.status(403).json('Le format de l\'email est incorrect'); 
        }
        // let's check that password and password-confirmation are the same
        if (password !== passwordConfirm) {
            // they are not the same;
            return response.status(403).json('La confirmation du mot de passe a échoué');
        }
        // we hash password
        const hashedPwd = bcrypt.hashSync(password, 10)
        

        // we add the new seller in database
        
        await Seller.create({
            gender,
            email,
            password: hashedPwd,
            lastname,
            firstname,
            phone_number,
            street_name,
            street_number,
            city,
            zipcode,
            picture_url,
            siret,
            shop_name,
            shop_presentation
        });
        
        response.status(200).json('success');
    } catch(error) {
      response.status(500).json(error.toString())
    }
},


    getAllSellers: async (request, response) => {
    try {
      const sellers = await Seller.findAll({ 
        attributes: { exclude: ['password'] } // we don't want the password to be seen in the object we will send
      });

      if (!sellers) {
        return response.status(404).json('Cant find sellers');
      }
      
      response.json(sellers);

    } catch (error) {
      console.trace(error);
      response.status(500).json(error.toString());
    }
  },

  getOneSeller: async (request, response) => {
    try {
      const sellerId = request.params.id;
      const seller = await Seller.findByPk(sellerId, {
        attributes: { exclude: ['password'] } // we don't want the password to be seen in the object we will send    
      });
      
      if (seller) {  
        response.status(200).json(seller);
      
    } else {
        response.status(404).json('Cant find seller with id ' + sellerId);
      }
    } catch (error) {
      console.trace(error);
      response.status(500).json(error.toString());
    }
  },

  editSellerProfile: async (request, response) => {
    try {
        const sellerId = request.params.id;

        // console.log("request.user", request.user)
        // console.log("request.user.userId", request.user.userId)
        // if (sellerId != request.user.userId || request.user.role !== 'seller') {
        //   return response.status(401).json('You have no right to edit seller :' + sellerId);
        // }

        const { email, password, passwordConfirm } = request.body;
   
        let seller = await Seller.findByPk(sellerId);
        if (!seller) {
          response.status(404).json(`Cant find seller with id ${sellerId}`);
        } else {

            if (email) {
                //on checke que l'email a un format valide
                if (!validator.validate(request.body.email)) {
                    // the email given has not valid format 
                    return response.status(403).json('Le format de l\'email est incorrect'); 
                }
                const sellerExists = await Seller.findOne({
                    where: {
                        email: email,
                    }
                });

                if (sellerExists) {
                    // il y a déjà un seller avec cet email, on envoie une erreur
                    // there is already a seller with this email => error
                    return response.status(403).json('Un compte existe déjà avec cet email, veuillez réessayer avec un autre email');
                }
            } 
            // if we get here, it means that email format is valid and no other seller has this email


            // on ne change que les paramètre envoyés
            // we patch with received data only
            for(const element in request.body) {
                //console.log(element)
                if (seller[element] && element!= 'password') { // we check that request.body doesn't contain anything unwanted, so it CAN'T contain properties that seller does not have (except passwordConfirm). We don't 
                    seller[element] = request.body[element] // instead of having 14 conditions like ` if (email) { seller.email = email } ` this will do all the work in 2 lines
                    //console.log("OK pour : "+element)
                } else {
                    //console.log(element+" n'est pas une propriété attendue ici")
                }
            }

            if (password) {
                if (password != passwordConfirm) {
                    return response.status(403).json('La confirmation du mot de passe a échoué');
                }

                const hashedPwd = bcrypt.hashSync(request.body.password, 10)
                seller.password = hashedPwd;
            }

            // other way to do this :
            //     if (firstname) {
            //        seller.firstname = firstname;
            //     }
            //     if (lastname) {
            //        seller.lastname = lastname;
            //     }
            

          await seller.save();
          
          const updatedSeller = await Seller.findByPk(sellerId, {
            attributes: { exclude: ['password'] } // we don't want the password to be seen in the object we will send 
          });

          response.json(updatedSeller);
        }
    } catch (error) {
      console.trace(error);
      response.status(500).json(error.toString());
    }
  },
};

module.exports = sellerController;


