//Function to check if the user already exists in the database
const emailLookUp =  (email, usersdB) => {
  for(const user in usersdB){
     if(usersdB[user].email === email){
       return user;
     }
   }
   return false;
 };


//It looks up for existing email ids of users
module.exports = { emailLookUp } ;