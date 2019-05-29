const express = require("express");
const router = express.Router();
const { validateUser } = require("../models/user");
const { setHash, getHash, removeItem, getAllHases } = require("../utils/redis");

module.exports = redisClient => {
  router.post("/register", (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
    } else {
      console.log("reb do", req.body);
      const { username } = req.body;
      getHash(redisClient, username, (err, user) => {
        console.log("errrr", err, "userrrrrrr", user);
        if (err) {
          res.send(err);
        } else if (user) {
          console.log("user exists already");
          res.status(400).send("user exissts");
        } else {
          setHash(redisClient, username, req.body, (err, user) => {
            if (err) {
              console.log("err registering user", err);
              res.send(err);
            } else {
              console.log("user reg success", user);
              res.send(user);
            }
          });
        }
      });
    }
  });

  router.post("/login", (req, res) => {
    const { username, password } = req.body;
    getHash(redisClient, username, (err, user) => {
      console.log("errrr", err, "userrrrrrr", user);
      if (err) {
        res.send(err);
      } else if (!user) {
        console.log("user not found");
        res.send({ err: "user not found" });
      } else {
        if (username === user.username && password === user.password) {
          res.send({ msg: "Login successful" });
        } else {
          res.send({ err: "user/password incorrect" });
        }
      }
    });
  });

  router.get("/", (req, res) => {
    getAllHases(redisClient, (err, users) => {
      console.log("errrr", err, "userrrrrrr", users);
      res.send(users)
      /*
      if (err) {
        res.send(err);
      } else if (suser) {
        console.log("user not found");
        res.send({ err: "user not found" });
      } else {
          res.send(users)
      }
      */
    });
  });

  //Update all package details
  router.put("/:username", (req, res) => {
    const { error } = validateUser(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
    } else {
      const { username } = req.params;
      getHash(redisClient, username, (err, user) => {
        console.log("errrr", err, "userrrrrrr", user);
        if (err) {
          res.send(err);
        } else if (!user) {
          console.log("user not exist");
          res.status(400).send({ err: "user does not exist" });
        } else {
          setHash(redisClient, username, req.body, (err, user) => {
            if (err) {
              console.log("err updating user", err);
              res.send(err);
            } else {
              console.log("user update success", user);
              res.send(user);
            }
          });
        }
      });
    }
  });

  router.delete("/:username", (req, res) => {
    const { username } = req.params;
    getHash(redisClient, username, (err, user) => {
      console.log("errrr", err, "userrrrrrr", user);
      if (err) {
        res.send(err);
      } else if (!user) {
        console.log("user not exist");
        res.status(404).send({ err: "user not exist" });
      } else {
        removeItem(redisClient, username, (err, results) => {
          if (err) {
            console.log("error deleting user", err);
            res.status(400).send({ err: "error deleting user" });
          } else {
            console.log(results);
            res.send(`delete status: Successful`);
          }
        });
      }
    });
  });

  return router;
};
/*
  //Delete package with specific id
  router.delete("/:id", (req, res) => {
    const { id } = req.params;
    redisClient.del(id);
    res.send("deleted");
  });
*/

//Initialise PackageId
//redisClient.set("package_id", "1");

//get package details
