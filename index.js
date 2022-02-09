const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneWhats = "+551149498171";

const client = require('twilio')(accountSid, authToken);

//json workers
const fs = require('fs');
const fileWorkers = fs.readFileSync('./workers.json', 'utf8');
        
async function getWorkers()
{
  await client.taskrouter.workspaces('WSbcdf81739e3aeb91c2e23fb82a296a56')
  .workers
  .list({limit: 500});  
  
}
async function createWorkers()
{   
  const data = JSON.parse(fileWorkers);
  let nome = "";
  try {
    
  for (let i = 0; i < data.length; i++) {  
    const element = data[i];
    //console.log(element);
    await client.taskrouter.workspaces('WSbcdf81739e3aeb91c2e23fb82a296a56')
                  .workers
                  .update({attributes:JSON.stringify(data[i].Attributes)});
                  
                  nome = data[i].FriendlyName;
                  
  console.log("usuario criado - " + data[i].FriendlyName);
  }
  } catch(err) {
    console.error("NOK - " + nome + " - " + err);
  }
}
async function updateWorkers()
{    
  var workers = await client.taskrouter.workspaces('WSbcdf81739e3aeb91c2e23fb82a296a56')
  .workers
  .list({limit: 1000})  
var nome = "";
  for (let i = 0; i < workers.length; i++) {  
    const data = JSON.parse(workers[i].attributes);
    nome = workers[i].friendlyName;
    if(data.roleCustom === "Agent" || data.roleCustom === "Central")
    {
      data['routing'] = {};
      data['routing']['skills'] = [data.equipe];
      data['routing']['levels'] = {};
    }
    data['agent_attribute_1'] = data.area;
    data['agent_label_1'] = "Área";
    data['agent_attribute_2'] = data.equipe;
    data['agent_label_2'] = "Equipe";

    data['equipe'] = data.equipe;
    data['area'] = data.area;

    //console.log(workers[i].friendlyName + " - " + JSON.stringify(data))
    
    await client.taskrouter.workspaces('WSbcdf81739e3aeb91c2e23fb82a296a56')
                  .workers(workers[i].sid)
                  .update({attributes:JSON.stringify(data)});
                  
  console.log("Update - " + nome);
}
}
async function deleteWorkers(){
  
  var workers = await client.taskrouter.workspaces('WSbcdf81739e3aeb91c2e23fb82a296a56')
  .workers
  .list({limit: 500})  
  let nome = "";
  //console.log(workers);
  try{
      for (let i = 0; i < workers.length; i++) {  
        //const data = JSON.parse(workers[i]);
        const data = workers[i];
        nome = data.friendlyName;
        //console.log(nome);
         if(nome.toLowerCase().includes("agent") || nome.toLowerCase().includes("wittel.com"))
         {
           console.log(nome);
         }
        // await client.taskrouter.workspaces('WSbcdf81739e3aeb91c2e23fb82a296a56')
        // .workers(data.sid)
        // .remove();

        // console.log("Removed - " + data.friendlyName);
      }
    } catch(err) {
      console.error("NOK - " + err);
    }
}