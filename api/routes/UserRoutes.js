const express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


//  Adding User Schama

const UserSchama = require('../model/UserSch');
const UserOtpVerification = require('../model/UserOtpVerificationSch');


router.post('/', (req, res, next) => {

    

    
    // bycripting password

    bcrypt.hash(req.body.Password,10, (err, hash) => {
        if(err)
        {
            return res.status(500).json({
                error: err
            })
        }else {

            // genareting otp

            const eOTP = `${Math.floor(1000+Math.random() * 9000)}`;
            // console.log(otp);

            const user = new UserSchama({
                _id : new mongoose.Types.ObjectId,
                UserName : req.body.UserName,
                Email : req.body.Email,
                Password : hash,
                otp: eOTP
            })

            // sending otp

        try {
            
            const mailTransporter = nodemailer.createTransport({
        
                service: "gmail",
        
                auth: {
                    user: "shailendra.pal551632@gmail.com",
                    pass: "dzmwriizwqbusfiw"
                }
            })
        
            const Details = {
                from: "shailendra.pal551632@gmail.com",
                to: req.body.Email,
        
                subject: "Test",
                text: `${eOTP} this is your otp.`
            }
        
            mailTransporter.sendMail(Details, (err) => {
                if(err){
                    console.log(err);
                }else{
                    console.log("Email sent.");
                }
            })

        } catch (error) {
            console.log(error);
        }

            user.save()
            .then(result => {
                res.status(200).json({
                    message : "User Registerd Successfully",
                    UserCreated : result
                })
            })
            .catch(err => {
                res.status(500).json({
                    error : err
                })
            })
        }
    })

  
});



router.post('/login', (req, res, next) => {
    UserSchama.find({
        UserName: req.body.UserName,
        otp: req.body.otp
    })
    .exec()
    .then(user => {
        if(user.length < 1)
        {
            return res.status(401).json({
                message : 'User Not Found'
            })
        }
        bcrypt.compare(req.body.Password, user[0].Password, (err, result) => {
            if(!result)
            {
                return res.status(401).json({
                    message : 'Password is incorrect.'
                })
            }

            if(result)
            {
                const token = jwt.sign({
                    UserName: user[0].UserName,
                    otp: user[0].otp
                },
                'this is test',
                    {
                        expiresIn: "24h"
                    }

                )
                res.status(200).json({
                    UserName : user[0].UserName,
                    otp: user[0].otp,
                    token : token
                })
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
})


module.exports = router;