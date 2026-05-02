const fs = require('fs');
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();
// ⚠️ Usa variables de entorno en producción
const TOKEN = process.env.TOKEN;

const STAFF_ROLE = "1495607314843959388";
const DIRECTOR_ROLE = "1414291242908516543";
const ROL_VERIFICADOR = "1414362482767822998"; // 👈 ponelo


const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot activo");
});

app.listen(3000, () => {
  console.log("🌐 Puerto abierto");
});


// ================= DATA =================

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 Mongo conectado"))
  .catch(err => console.log("❌ Error Mongo:", err));

const perfilSchema = new mongoose.Schema({
  userID: String,

  raza: String,
  clan: String,
  potencial: String,
  cuerpo: String,
  talento: String,
  energia: String,
  restriccion: String,
  hereditaria: String,

  rr: { type: Number, default: 5 },
  grado: { type: String, default: "4" },

  stats: {
    fuerza: { type: String, default: "Z" },
    durabilidad: { type: String, default: "Z" },
    velocidad: { type: String, default: "Z" },
    reaccion: { type: String, default: "Z" },
    resistencia: { type: String, default: "Z" },
    em: { type: String, default: "Z" }
  },

  spins: {
    clan: { type: Number, default: 1 },
    potencial: { type: Number, default: 1 },
    talento: { type: Number, default: 1 },
    energia: { type: Number, default: 1 },
    restriccion: { type: Number, default: 1 },
    raza: { type: Number, default: 1 },
    cuerpo: { type: Number, default: 1 },
    hereditaria: { type: Number, default: 1 }
  }
});

const Perfil = mongoose.model("Perfil", perfilSchema);



// ================= ESCALA =================
const escala = ["Z","Y","X","W","V","U","T","S","R","Q","P","O","N","M","Ω"];

const limites = {
  "4":["Z","Y","X"],
  "3":["W","V","U"],
  "2":["T","S","R"],
  "1":["Q","P","O"],
  "Especial":["N","M","Ω"]
};

// ================= TABLA STATS =================
const tabla = {
  Z:{f:15,v:20,d:15,res:150,r:25,em:100},
  Y:{f:25,v:25,d:20,res:250,r:35,em:150},
  X:{f:40,v:32,d:30,res:350,r:45,em:220},
  W:{f:60,v:45,d:50,res:450,r:60,em:350},
  V:{f:85,v:55,d:70,res:550,r:80,em:480},
  U:{f:120,v:75,d:95,res:650,r:100,em:650},
  T:{f:180,v:100,d:140,res:750,r:130,em:900},
  S:{f:260,v:130,d:200,res:950,r:170,em:1200},
  R:{f:380,v:170,d:280,res:1150,r:220,em:1600},
  Q:{f:550,v:250,d:450,res:1300,r:300,em:2200},
  P:{f:800,v:350,d:650,res:2500,r:450,em:3000},
  O:{f:1200,v:480,d:900,res:4000,r:600,em:4000},
  N:{f:2000,v:700,d:1500,res:7000,r:850,em:7000},
  M:{f:3500,v:950,d:2800,res:15000,r:1200,em:12000},
  Ω:{f:6000,v:1400,d:5000,res:30000,r:1800,em:20000}
};
// ================= Auto roles =================

const ROLES = {

  restriccion: {
    "Cuerpo por encima del alma": "1499930797614825583",
    "Alma por encima del cuerpo": "1499930855987089529",
    "Sin restriccion": "1499930725137256478"
  },  

  raza: {
    "Humano": "1497016994409746503",
    "Maldición": "1497017003821629510",
    "Útero maldito": "1497017006267044002",
    "Maldición desastre": "1497017010280730655"
  },

  grado: {
    "4": "1416933350639272016",
    "3": "1416933187812196485",
    "2": "1495932622793347162",
    "1": "1495932725914243173",
    "especial": "1495932772181868697"
  },

  clan: {
    "Gojo": "1416929197393182906",
    "Zenin": "1416929388284481567",
    "Kamo": "1416931393719505006",
    "Fujiwara": "1416931489014087831",
    "Ryomen": "1416932845959516262",
    "Nanami": "1416932511770083479",
    "Ishigori": "1495948686830600274",
    "Higuruma": "1495948649300099284",
    "Inumaki": "1416931615715885208",
    "Itadori": "1416932424704725092",
    "Todou": "1416932607891079228",
    "Kugisaki": "1416932751604449280",
    "Sin clan": "1495948801821773970"
  },

  energia: {
    "Energia comun": "1497061452752883783",
    "divina": "1495932946073256048",
    "helada": "1495933009562570823",
    "ignea": "1495933084888203316",
    "liquida": "1495933164252696597",
    "aspera": "1495933215968596028",
    "electrica": "1495933296851423343"
  },

  cuerpo: {
    "Cuerpo comun": "1497061373278949448",
    "cuerpo reforzado": "1495933409057439855",
    "cuerpo ligero": "1452308750315687986",
    "cuerpo de em": "1452308818326458458",
    "cuerpo equilibrado": "1495986467959345234",
    "cuerpo extraño": "1495933465638600914",
    "cuerpo bestial": "1495933523796693102",
    "cuerpo fantasma": "1495933579723538536",
    "cuerpo ancla": "1495933683029508248",
    "cuerpo resonante": "1495933763027210401",
    "cuerpo depredador": "1495933828080861234",
    "cuerpo perfecto": "1495933906938101801",
    "cuerpo divino": "1495933979902083142"
  },

  talento: {
    "Sin talento" : "1497061273941053481",
    "Rey de blackflash": "1495935943864225862",
    "Experto en barrera": "1495934851969454080",
    "Experto en alma": "1495947753191116942",
    "Experto en rct": "1495934755990929601",
    "Gallo de pelea": "1495947672325193909",
    "Experto en pactos": "1495987985680699473"
  },

  potencial: {
    "bajo": "1416928312567136276",
    "normal": "1416928452044521586",
    "medio": "1416928576636194876",
    "prodigio": "1416928747776376955",
    "especial": "1416928909680836608"
  }
};

async function getPerfil(userID) {
  let p = await Perfil.findOne({ userID });
  if (!p) {
    p = new Perfil({ userID });
    await p.save();
  }
  return p;
}

async function syncRoles(member, tipo, valor) {

  valor = (valor || "").trim();

  const categoria = ROLES[tipo];
  if (!categoria) return;

  // 🔥 buscar clave correcta ignorando mayúsculas
 let roleKey = Object.keys(categoria).find(
  k => k.toLowerCase() === valor.toLowerCase()
);

  if (!roleKey) return; // no existe ese rol

  const newRoleId = categoria[roleKey];

  // 🔥 quitar roles anteriores
  for (const key in categoria) {
    const roleId = categoria[key];
    if (member.roles.cache.has(roleId)) {
      await member.roles.remove(roleId).catch(()=>{});
    }
  }

  // 🔥 agregar nuevo
  if (!member.roles.cache.has(newRoleId)) {
    await member.roles.add(newRoleId).catch(()=>{});
  }
}

// ================= ROLL =================
function roll(arr){
  if(!arr || arr.length === 0) return null;

  let total = arr.reduce((a,b)=>a+b.prob,0);
  let r = Math.random()*total;

  for(const i of arr){
    r -= i.prob;
    if(r < 0) return i.name;
  }

  return arr[0].name;
}

// ================= LISTAS =================
const raza = [
  {name:"Humano", prob:45},
  {name:"Maldición", prob:45},
  {name:"Útero maldito", prob:5},
  {name:"Maldición desastre", prob:5}
];
const clanes = [
  {name:"Gojo",prob:1},{name:"Zenin",prob:1},{name:"Kamo",prob:1},
  {name:"Ryomen",prob:1},{name:"Fujiwara",prob:1},
  {name:"Inumaki",prob:8},{name:"Nanami",prob:8},{name:"Higuruma",prob:8},
  {name:"Ishigori",prob:8},{name:"Todou",prob:8},{name:"Kugisaki",prob:8},{name:"Itadori",prob:8},
  {name:"Sin clan",prob:39}
];

const cuerpos = [
  {name:"Cuerpo comun", prob:20},
  {name:"Cuerpo Reforzado", prob:10},
  {name:"Cuerpo Ligero", prob:10},
  {name:"Cuerpo de EM", prob:10},
  {name:"Cuerpo equilibrado", prob:10},
  {name:"Cuerpo extraño", prob:6},
  {name:"Cuerpo bestial", prob:6},
  {name:"Cuerpo fantasma", prob:6},
  {name:"Cuerpo Ancla", prob:6},
  {name:"Cuerpo resonante", prob:6},
  {name:"Cuerpo depredador", prob:6},
  {name:"Cuerpo Perfecto", prob:3},
  {name:"Cuerpo Divino", prob:1}
];

const potenciales = [
  {name:"Bajo",prob:50},{name:"Normal",prob:25},
  {name:"Medio",prob:19},{name:"Prodigio",prob:5},{name:"Especial",prob:1}
];

const talento = [
  {name:"Sin talento",prob:35.5},
  {name:"Gallo de pelea",prob:0.5},
  {name:"Experto en alma",prob:0.5},
  {name:"Vinculo compartido",prob:15},
  {name:"Experto en rct",prob:15},
  {name:"Experto en barrera",prob:15},
  {name:"Experto en pactos",prob:15},
  {name:"Rey de blackflash",prob:0.5}
];

const energias = [
  {name:"Energia comun",prob:30},
  {name:"Divina",prob:1},{name:"Ignea",prob:18},
  {name:"Liquida",prob:18},{name:"Aspera",prob:18},
  {name:"Helada",prob:10},{name:"Electrica",prob:5}
];

const restricciones = [
  {name:"Cuerpo por encima del alma",prob:1},
  {name:"Alma por encima del cuerpo",prob:5},
  {name:"Sin restriccion",prob:94}
];

const hereditariaPorClan = {
  Zenin: [{name:"10 Sombras",prob:1},{name:"Proyección",prob:10},{name:"sin hereditaria",prob:89}],
  Gojo: [{name:"Limitless",prob:10},{name:"sin hereditaria",prob:90}],
  Kamo: [{name:"Manipulación de sangre",prob:10},{name:"sin hereditaria",prob:90}],
  Ryomen: [{name:"Shrine",prob:10},{name:"sin hereditaria",prob:90}],
  Fujiwara: [{name:"Mimetismo",prob:10},{name:"sin hereditaria",prob:90}],
  Inumaki: [{name:"Discurso maldito",prob:20},{name:"sin hereditaria",prob:80}],
  Nanami: null,
  Higuruma: null,
  Ishigori: [{name:"Cañón de energía",prob:20},{name:"sin hereditaria",prob:80}],
  Todou: [{name:"Boogie Woogie",prob:20},{name:"sin hereditaria",prob:80}],
  Kugisaki: null,
  Itadori: null,
  "Sin clan": null
};

// ================= PERFIL =================
async function createProfile(id){
  const p = new Perfil({ userID: id });
  await p.save();
}

// ================= MULTI =================
function getMulti(p){
  let m={f:1,d:1,v:1,r:1,res:1,em:1};
  const add=(k,v)=>m[k]+=v;
  const all=v=>{for(let k in m)m[k]+=v;}

  if (p.raza === "Útero maldito") {all(0.3);}
  if (p.raza === "Maldición desastre") {all(0.4);}

  if(p.potencial==="Normal") all(0.2);
  if(p.potencial==="Medio") all(0.5);
  if(p.potencial==="Prodigio") all(0.8);
  if(p.potencial==="Especial") all(1);

  if (p.cuerpo === "Cuerpo Reforzado") {
  add("f", 0.5);
  add("d", 0.5);
}

if (p.cuerpo === "Cuerpo Ligero") {
  add("v", 0.5);
  add("r", 0.5);
}

if (p.cuerpo === "Cuerpo de EM") {
  add("em", 0.5);
}

if (p.cuerpo === "Cuerpo equilibrado") {
  add("f", 0.25);
  add("d", 0.25);
  add("v", 0.25);
  add("r", 0.25);
  add("em", 0.25);
}

if (p.cuerpo === "Cuerpo extraño") {
  add("f", 0.3);
  add("d", 0.3);
  add("v", 0.2);
  add("r", 0.2);
}

if (p.cuerpo === "Cuerpo bestial") {
  add("f", 0.5);
  add("d", 0.3);
  add("v", 0.1);
}

if (p.cuerpo === "Cuerpo fantasma") {
  add("v", 0.5);
  add("r", 0.3);
  add("d", 0.1);
}

if (p.cuerpo === "Cuerpo Ancla") {
  add("d", 0.5);
  add("f", 0.3);
  add("v", 0.1);
}

if (p.cuerpo === "Cuerpo resonante") {
  add("em", 0.5);
  add("r", 0.3);
  add("d", 0.1);
}

if (p.cuerpo === "Cuerpo depredador") {
  add("r", 0.5);
  add("v", 0.3);
  add("f", 0.1);
}

if (p.cuerpo === "Cuerpo Perfecto") {
  add("f", 0.4);
  add("d", 0.4);
  add("v", 0.4);
  add("r", 0.4);
  add("em", 0.4);
}

if (p.cuerpo === "Cuerpo Divino") {
  add("f", 0.7);
  add("d", 0.7);
  add("v", 0.7);
  add("r", 0.7);
  add("em", 0.7);
}
// ===== CLANES ALTOS =====

if (p.clan === "Gojo") {
  add("r", 0.7);   // reacción (Six Eyes)
  add("v", 0.5);   // velocidad
  add("d", 0.3);   // defensa
  add("em", 1);    // energía maldita alta
}

if (p.clan === "Kamo") {
  add("res", 0.7); // resistencia (sangre)
  add("f", 0.5);   // fuerza
  add("d", 0.3);   // durabilidad
  add("em", 0.7);
}

if (p.clan === "Zenin") {
  add("f", 0.7);   // velocidad (Toji/Maki vibes)
  add("r", 0.5);   // reacción
  add("v", 0.3);   // fuerza
  add("em", 0.6);
}

if (p.clan === "Fujiwara") {
  add("em", 0.9);  // muy enfocados en técnica
  add("r", 0.7);   // reacción
  add("v", 0.5);   // velocidad
  add("d", 0.3);   // defensa
}

if (p.clan === "Ryomen") {
  add("f", 0.7);   // fuerza brutal (Sukuna)
  add("d", 0.5);   // durabilidad
  add("res", 0.3); // resistencia
  add("em", 0.8);
}


// ===== CLANES CHICOS =====

if (p.clan === "Inumaki") {
  add("r", 0.5);
  add("v", 0.3);
  add("em", 0.5);
}

if (p.clan === "Nanami") {
  add("f", 0.5);
  add("d", 0.3);
  add("em", 0.3);
}

if (p.clan === "Higuruma") {
  add("r", 0.5);
  add("res", 0.3);
  add("em", 0.6);
}

if (p.clan === "Ishigori") {
  add("f", 0.5);
  add("d", 0.3);
  add("em", 0.6);
}

if (p.clan === "Todou") {
  add("f", 0.5);
  add("res", 0.3);
  add("em", 0.3);
}

if (p.clan === "Kugisaki") {
  add("v", 0.5);
  add("r", 0.3);
  add("em", 0.5);
}


// ===== ITADORI (ESPECIAL) =====

if (p.clan === "Itadori") {
  add("f", 0.6);
  add("d", 0.4);
  add("v", 0.2);
  add("em", 0.4);
}

  if(p.restriccion==="Cuerpo por encima del alma") all(2.5);
  if(p.restriccion==="Alma por encima del cuerpo") add("em",10);

  return m;
}

// ================= CALC =================
function calc(p){
  const m = getMulti(p);
  return {
    fuerza:Math.round(tabla[p.stats.fuerza].f*m.f),
    durabilidad:Math.round(tabla[p.stats.durabilidad].d*m.d),
    velocidad:Math.round(tabla[p.stats.velocidad].v*m.v),
    reaccion:Math.round(tabla[p.stats.reaccion].r*m.r),
    resistencia:Math.round(tabla[p.stats.resistencia].res*m.res),
    em:Math.round(tabla[p.stats.em].em*m.em)
  };
}

function puedeHereditaria(p){
  if(!p.clan) return false;
  if(["Itadori","Higuruma","Nanami","Kugisaki","Sin clan"].includes(p.clan)) return false;
  return !!hereditariaPorClan[p.clan];
}

// ================= BOT =================
const client = new Client({
  intents:[GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent]
});

client.on("ready",()=>console.log("🔥 BOT LISTO"));

client.on("messageCreate", async msg => {
  if(msg.author.bot) return;

const id = msg.author.id;
const args = msg.content.split(" ");

if (msg.content === "-start") {

  let existente = await Perfil.findOne({ userID: id });

  if (existente) {
    return msg.reply("❌ Ya tienes perfil");
  }

  await createProfile(id);

  return msg.reply("✨ Perfil creado correctamente");
}

let p = await getPerfil(id);

if (!p) {
  p = new Perfil({ userID: id });
  await p.save();
}

if(!p) return;
// ================= Subir stats =================
if (msg.content.startsWith("-subir")) {

  const stat = args[1];
  if (!stat) return msg.reply("❌ Usa: -subir fuerza/durabilidad/resistencia/velocidad/vel.reaccion/energia");

  const mapa = {
    fuerza: "fuerza",
    durabilidad: "durabilidad",
    resistencia: "resistencia",
    velocidad: "velocidad",
    "vel.reaccion": "reaccion",
    energia: "em"
  };

  const key = mapa[stat];
  if (!key) return msg.reply("❌ Stat inválida");

  const actual = p.stats[key];
  const index = escala.indexOf(actual);

  if (index === -1) return msg.reply("❌ Error en stat");

  // límite por grado
  const limiteGrado = limites[p.grado];
  const maxIndexPermitido = escala.indexOf(limiteGrado[limiteGrado.length - 1]);

  // ya está en el máximo permitido del grado
  if (index >= maxIndexPermitido) {
    return msg.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("🚫 Límite alcanzado")
          .setDescription(
            `📊 Stat: **${stat}**\n\n` +
            `⛔ Ya alcanzaste el máximo permitido para tu grado (**${p.grado}**).\n` +
            `⬆️ Debes ascender para seguir mejorando.`
          )
      ]
    });
  }

  // 👇 guardamos antes
  const antes = p.stats[key];

  // subir stat
  p.stats[key] = escala[index + 1];

  const despues = p.stats[key];

  await p.save();

  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#00FFAA")
        .setTitle("📈 Mejora de Stat")
        .setDescription(
          `👤 Usuario: **${msg.author.username}**\n\n` +
          `📊 Stat: **${stat}**\n\n` +
          `📉 Antes: **${antes}**\n` +
          `📈 Ahora: **${despues}**\n\n` +
          `🎖️ Grado actual: **${p.grado}**`
        )
    ]
  });
}

if (msg.content.startsWith("-bajar")) {

  // 🔒 SOLO DIRECTOR
  if (!msg.member.roles.cache.has(DIRECTOR_ROLE)) {
    return msg.reply("❌ Solo un Director puede usar este comando");
  }

  const target = msg.mentions.users.first();
  const statInput = args[2];

  if (!target || !statInput) {
    return msg.reply("❌ Usa: -bajar @usuario fuerza/durabilidad/resistencia/velocidad/vel.reaccion/energia");
  }

  const mapa = {
    fuerza: "fuerza",
    durabilidad: "durabilidad",
    resistencia: "resistencia",
    velocidad: "velocidad",
    "vel.reaccion": "reaccion",
    energia: "em"
  };

  const stat = mapa[statInput.toLowerCase()];
  if (!stat) return msg.reply("❌ Stat inválida");

let pTarget = await Perfil.findOne({ userID: target.id });

if (!pTarget) {
  pTarget = new Perfil({ userID: target.id });
  await pTarget.save();
}

  const actual = pTarget.stats[stat];
  const index = escala.indexOf(actual);

  if (index === -1) return msg.reply("❌ Error en stat");

  // 🚫 ya está en el mínimo
  if (index === 0) {
    return msg.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle("🚫 Límite mínimo alcanzado")
          .setDescription(
            `👤 Usuario: **${target.username}**\n\n` +
            `📊 Stat: **${statInput}**\n\n` +
            `⛔ Ya está en el nivel más bajo (**${actual}**)`
          )
      ]
    });
  }

  const antes = actual;

  // 🔻 bajar stat
  pTarget.stats[stat] = escala[index - 1];

  const despues = pTarget.stats[stat];

  await pTarget.save();

  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#FF4444")
        .setTitle("📉 Reducción de Stat")
        .setDescription(
          `👤 Usuario: **${target.username}**\n` +
          `🛠️ Aplicado por: **${msg.author.username}**\n\n` +
          `📊 Stat: **${statInput}**\n\n` +
          `📈 Antes: **${antes}**\n` +
          `📉 Ahora: **${despues}**`
        )
    ]
  });
}

// ================= Agregar RR =================

if (msg.content.startsWith("-agregarRR")) {

  if (!msg.member.roles.cache.has(STAFF_ROLE)) {
    return msg.reply("❌ No tienes permisos");
  }

  const target = msg.mentions.users.first();
  const amount = parseInt(args[2]);

  if (!target || isNaN(amount)) {
    return msg.reply("❌ Usa: -agregarRR @usuario cantidad");
  }

  let pTarget = await Perfil.findOne({ userID: target.id });

  if (!pTarget) {
    pTarget = new Perfil({ userID: target.id });
  }

  const antes = pTarget.rr;

  pTarget.rr += amount;

  const despues = pTarget.rr;

  await pTarget.save(); // 🔥 IMPORTANTE (no p.save)

  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#00FF99")
        .setTitle("🛠️ Agregar RR")
        .setDescription(
          `👤 Usuario: **${target.username}**\n\n` +
          `📥 Cantidad agregada: **${amount} RR**\n\n` +
          `📉 Antes: **${antes} RR**\n` +
          `📈 Ahora: **${despues} RR**`
        )
    ]
  });
}

// ================= Dar RR =================
if (msg.content.startsWith("-darRR")) {

  const target = msg.mentions.users.first();
  const amount = parseInt(args[2]);

  if (!target || isNaN(amount)) {
    return msg.reply("❌ Usa: -darRR @usuario cantidad");
  }

  // 🔥 obtener perfiles
  let pAutor = await Perfil.findOne({ userID: msg.author.id });
  let pTarget = await Perfil.findOne({ userID: target.id });

  if (!pAutor || !pTarget) {
    return msg.reply("❌ Uno de los usuarios no tiene perfil");
  }

  if (pAutor.rr < amount) {
    return msg.reply("❌ No tienes suficiente RR");
  }

  const antesAutor = pAutor.rr;
  const antesTarget = pTarget.rr;

  // 🔄 transferencia
  pAutor.rr -= amount;
  pTarget.rr += amount;

  const despuesAutor = pAutor.rr;
  const despuesTarget = pTarget.rr;

  // 💾 guardar ambos
  await pAutor.save();
  await pTarget.save();

  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#FFAA00")
        .setTitle("🔄 Transferencia de RR")
        .setDescription(
          `👤 Emisor: **${msg.author.username}**\n` +
          `🎯 Receptor: **${target.username}**\n\n` +
          `💸 Cantidad: **${amount} RR**\n\n` +
          `📉 ${msg.author.username}: **${antesAutor} → ${despuesAutor}**\n` +
          `📈 ${target.username}: **${antesTarget} → ${despuesTarget}**`
        )
    ]
  });
}

// ================= Ascender grado =================
if (msg.content.startsWith("-ascender")) {

  const args = msg.content.split(" ");
  const target = msg.mentions.users.first();
  const nuevoGrado = args[2];
  const member = msg.guild.members.cache.get(target.id);
  if (member) {
  await syncRoles(member, "grado", nuevoGrado.toLowerCase());
}

  if (!msg.member.roles.cache.has(STAFF_ROLE)) {
    return msg.reply("❌ No tienes permisos");
  }

  if (!target || !nuevoGrado) {
    return msg.reply("❌ Usa: -ascender @user 4/3/2/1/Especial");
  }

  // 🔥 buscar perfil en Mongo
  let pTarget = await Perfil.findOne({ userID: target.id });

  if (!pTarget) {
    return msg.reply("❌ No tiene perfil");
  }

  // 👇 guardar anterior
  const antes = pTarget.grado || "Sin grado";

  // 🔥 actualizar grado
  pTarget.grado = nuevoGrado;

  await pTarget.save(); // ✔️ correcto

  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#FFD700")
        .setTitle("🎖️ Ascenso de Grado")
        .setDescription(
          `👤 Usuario: **${target.username}**\n\n` +
          `📉 Grado anterior: **${antes}**\n` +
          `📈 Nuevo grado: **${nuevoGrado}**\n\n` +
          `🏆 Estado: **Ascendido correctamente**`
        )
    ]
  });
}

// ============= agregarSpin =================
if (msg.content.startsWith("-agregarSpin")) {

  if (!msg.member.roles.cache.has(STAFF_ROLE)) {
    return msg.reply("❌ No tienes permisos");
  }

  const args = msg.content.split(" ");

  const tipo = args[1]?.toLowerCase();
  const target = msg.mentions.users.first();
  const valorRaw = args.slice(2, args.length - 1).join(" ");

  if (!tipo || !valorRaw || !target) {
    return msg.reply("❌ Usa: -agregarSpin tipo valor @usuario");
  }

  // 🔥 BUSCAR EN MONGO
  let pTarget = await Perfil.findOne({ userID: target.id });

  if (!pTarget) {
    return msg.reply("❌ No tiene perfil");
  }

  const targetMember = msg.guild.members.cache.get(target.id);

  const listas = {
    clan: clanes,
    raza: raza,
    cuerpo: cuerpos,
    potencial: potenciales,
    talento: talento,
    energia: energias,
    restriccion: restricciones
  };

  const lista = listas[tipo];
  if (!lista) return msg.reply("❌ Tipo inválido");

  const encontrado = lista.find(x =>
    x.name.toLowerCase() === valorRaw.toLowerCase()
  );

  if (!encontrado) {
    return msg.reply("❌ Valor inválido");
  }

  // 👇 valor anterior
  const antes = pTarget[tipo] || "Ninguno";

  // 🔥 SETEAR NUEVO VALOR
  pTarget[tipo] = encontrado.name;

  // 🔥 marcar spin como usado
  if (pTarget.spins && pTarget.spins[tipo] !== undefined) {
    pTarget.spins[tipo] = 0;
  }

  // 🔥 reset hereditaria si cambia clan
  if (tipo === "clan") {
    pTarget.hereditaria = null;
  }

  // 🔥 ROLES
  try {
    if (targetMember) {
      await syncRoles(targetMember, tipo, encontrado.name);
    }
  } catch (err) {
    console.log(err);
  }

  // 💾 GUARDAR BIEN
  await pTarget.save();

  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#00FF99")
        .setTitle("🛠️ Modificación de Spin")
        .setDescription(
          `👤 Usuario: **${target.username}**\n` +
          `📌 Tipo: **${tipo}**\n\n` +
          `📉 Antes: **${antes}**\n` +
          `📈 Ahora: **${encontrado.name}**\n\n` +
          `🧩 Spin marcado como: **Usado**`
        )
    ]
  });
}
// ================= Reset ==================
if (msg.content.startsWith("-reset")) {

  // 🔒 SOLO DIRECTOR
  if (!msg.member.roles.cache.has(DIRECTOR_ROLE)) {
    return msg.reply("❌ Solo un Director puede usar este comando");
  }

  const target = msg.mentions.users.first() || msg.author;

  let pTarget = await Perfil.findOne({ userID: target.id });

  if (!pTarget) {
    return msg.reply("❌ No tiene perfil");
  }

  const member = msg.guild.members.cache.get(target.id);

  // 🔥 GUARDAR RR
  const rrAntes = pTarget.rr;

  // ================= QUITAR TODOS LOS ROLES DEL SISTEMA =================
  try {
    if (member) {
      for (const tipo in ROLES) {
        const categoria = ROLES[tipo];

        for (const key in categoria) {
          const roleId = categoria[key];

          if (member.roles.cache.has(roleId)) {
            await member.roles.remove(roleId).catch(()=>{});
          }
        }
      }
    }
  } catch (err) {
    console.log("Error quitando roles:", err);
  }

  // ================= RESET PERFIL =================
  pTarget.raza = null;
  pTarget.clan = null;
  pTarget.cuerpo = null;
  pTarget.talento = null;
  pTarget.energia = null;
  pTarget.potencial = null;
  pTarget.restriccion = null;
  pTarget.hereditaria = null;

  pTarget.grado = "4";

  pTarget.stats = {
    fuerza: "Z",
    durabilidad: "Z",
    velocidad: "Z",
    reaccion: "Z",
    resistencia: "Z",
    em: "Z"
  };

  pTarget.spins = {
    clan: 1,
    potencial: 1,
    talento: 1,
    energia: 1,
    restriccion: 1,
    raza: 1,
    cuerpo: 1,
    hereditaria: 1
  };

  // 🔥 mantener RR
  pTarget.rr = rrAntes;

  await pTarget.save();

  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#FF4444")
        .setTitle("🔄 Reset Completo")
        .setDescription(
          `👤 Usuario: **${target.username}**\n\n` +
          `♻️ Perfil reiniciado correctamente\n\n` +
          `🎖️ Grado: **4**\n` +
          `🎟️ RR conservados: **${rrAntes}**\n\n` +
          `🧹 Roles eliminados\n` +
          `🧩 Spins restaurados`
        )
    ]
  });
}

// ===== SPINS =====
if(!p.spins){
  p.spins = {
    clan: 1,
    potencial: 1,
    talento: 1,
    energia: 1,
    restriccion: 1,
    raza: 1,
    cuerpo: 1,
    hereditaria: 1
  };
}

// ===== CLAN =====
if(msg.content === "-clan"){

  if(p.spins.clan <= 0)
    return msg.reply("❌ Ya hiciste tu spin de clan. Usa -rr clan");

  p.clan = roll(clanes);
  await syncRoles(msg.member, "clan", p.clan);

  p.spins.clan = 0;

  await p.save();
  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#FFD700")
        .setTitle("🎰 Spin de Clan")
        .setDescription(`🏯 Resultado: **${p.clan}**\n\n🧩 Spins restantes: **${p.spins.clan}**`)
    ]
  });
}

// ===== POTENCIAL =====
if(msg.content === "-potencial"){

  if(p.spins.potencial <= 0)
    return msg.reply("❌ Ya hiciste este spin");

  p.potencial = roll(potenciales);
  await syncRoles(msg.member, "potencial", p.potencial);

  p.spins.potencial = 0;

  await p.save();
  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#00BFFF")
        .setTitle("🎰 Spin de Potencial")
        .setDescription(`📊 Resultado: **${p.potencial}**\n\n🧩 Spins restantes: **${p.spins.potencial}**`)
    ]
  });
}

// ===== TALENTO =====
if(msg.content === "-talento"){

  if(p.spins.talento <= 0)
    return msg.reply("❌ Ya hiciste este spin");

  p.talento = roll(talento);
  await syncRoles(msg.member, "talento", p.talento);

  p.spins.talento = 0;

  await p.save();
  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#FF69B4")
        .setTitle("🎰 Spin de Talento")
        .setDescription(`🎯 Resultado: **${p.talento}**\n\n🧩 Spins restantes: **${p.spins.talento}**`)
    ]
  });
}

// ===== ENERGIA =====
if(msg.content === "-energia"){

  if(p.spins.energia <= 0)
    return msg.reply("❌ Ya hiciste este spin");

  p.energia = roll(energias);
  await syncRoles(msg.member, "energia", p.energia);

  p.spins.energia = 0;

  await p.save();
  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#FFFF00")
        .setTitle("🎰 Spin de Energía")
        .setDescription(`⚡ Resultado: **${p.energia}**\n\n🧩 Spins restantes: **${p.spins.energia}**`)
    ]
  });
}

// ===== RESTRICCION =====
if(msg.content === "-restriccion"){

  if(p.spins.restriccion <= 0)
    return msg.reply("❌ Ya hiciste este spin");

  p.restriccion = roll(restricciones);
  await syncRoles(msg.member, "restriccion", p.restriccion);

  p.spins.restriccion = 0;

  await p.save();
  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#A9A9A9")
        .setTitle("🎰 Spin de Restricción")
        .setDescription(`⛓️ Resultado: **${p.restriccion}**\n\n🧩 Spins restantes: **${p.spins.restriccion}**`)
    ]
  });
}

// ===== RAZA =====
if(msg.content === "-raza"){

  if(p.spins.raza <= 0)
    return msg.reply("❌ Ya hiciste este spin");

  p.raza = roll(raza);
  await syncRoles(msg.member, "raza", p.raza);

  p.spins.raza = 0;

  await p.save();
  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#8A2BE2")
        .setTitle("🎰 Spin de Raza")
        .setDescription(`🧬 Resultado: **${p.raza}**\n\n🧩 Spins restantes: **${p.spins.raza}**`)
    ]
  });
}

// ===== CUERPO =====
if(msg.content === "-cuerpo"){

  if(p.spins.cuerpo <= 0)
    return msg.reply("❌ Ya hiciste tu spin de cuerpo. Usa -rr cuerpo");

  p.cuerpo = roll(cuerpos);
  await syncRoles(msg.member, "cuerpo", p.cuerpo);

  p.spins.cuerpo = 0;

  await p.save();
  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#FFA500")
        .setTitle("🎰 Spin de Cuerpo")
        .setDescription(`🧍 Resultado: **${p.cuerpo}**\n\n🧩 Spins restantes: **${p.spins.cuerpo}**`)
    ]
  });
}

// ===== HEREDITARIA =====
if(msg.content === "-hereditaria"){

  if(p.spins.hereditaria <= 0)
    return msg.reply("❌ Ya hiciste este spin");

  if(!puedeHereditaria(p))
    return msg.reply("❌ Este clan no puede tener hereditaria");

  const pool = hereditariaPorClan[p.clan];
  p.hereditaria = roll(pool);

  p.spins.hereditaria = 0;

  await p.save();
  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#7FFF00")
        .setTitle("🎰 Spin de Hereditaria")
        .setDescription(`🧬 Resultado: **${p.hereditaria}**\n\n🧩 Spins restantes: **${p.spins.hereditaria}**`)
    ]
  });
}

// ================= RR =================
if(msg.content.startsWith("-rr")){

  if(p.rr <= 0) return msg.reply("❌ Sin RR");

  let t = args[1];
  let res;
  const antes = p[t]; // 👈 guardamos el anterior

  if(t === "clan"){
    res = roll(clanes);
    p.clan = res;
    await syncRoles(msg.member, "clan", res.toLowerCase());
  }

  else if(t === "potencial"){
    res = roll(potenciales);
    p.potencial = res;
    await syncRoles(msg.member, "potencial", res.toLowerCase());
  }

  else if(t === "talento"){
    res = roll(talento);
    p.talento = res;
    await syncRoles(msg.member, "talento", res.toLowerCase());
  }

  else if(t === "energia"){
    res = roll(energias);
    p.energia = res;
    await syncRoles(msg.member, "energia", res.toLowerCase());
  }

  else if(t === "raza"){
    res = roll(raza);
    p.raza = res;
    await syncRoles(msg.member, "raza", res.toLowerCase());
  }

  else if(t === "cuerpo"){
    res = roll(cuerpos);
    p.cuerpo = res;
    await syncRoles(msg.member, "cuerpo", res.toLowerCase());
  }

  else if(t === "restriccion"){
  res = roll(restricciones);
  p.restriccion = res;
  await syncRoles(msg.member, "restriccion", res);
}

  else if(t === "hereditaria"){

    if(!puedeHereditaria(p))
      return msg.reply("❌ No puedes rerrollear hereditaria");

    const pool = hereditariaPorClan[p.clan];
    res = roll(pool);
    p.hereditaria = res;
  }

  else{
    return msg.reply("❌ Tipo inválido");
  }

  p.rr--;

  await p.save();

  return msg.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#FF4444")
        .setTitle(`🔄 RR de ${t}`)
        .setDescription(
          `📉 Antes: **${antes || "Ninguno"}**\n` +
          `📈 Ahora: **${res}**\n\n` +
          `🎟️ RR restantes: **${p.rr}**`
        )
    ]
  });
}


if (msg.content.startsWith("-multis")) {

  let u = msg.mentions.users.first() || msg.author;
  let d = await Perfil.findOne({ userID: u.id });
  if (!d) return msg.reply("❌ Sin perfil");

  // ================= BUILD =================

  function build(base, extras, restriccionGlobal = 0) {
    let total = base;
    let txt = [`${base}`];

    extras.forEach(e => {
      if (e.valor !== 0) {
        txt.push(`+ ${e.valor} (${e.nombre})`);
        total += e.valor;
      }
    });

    if (restriccionGlobal > 0) {
      txt.push(`+ ${restriccionGlobal} (restricción)`);
      total += restriccionGlobal;
    }

    return {
      texto: txt.join(" "),
      total: total.toFixed(2)
    };
  }

  // ================= BASE EXTRAS =================

  function baseExtras(stat) {
    let arr = [];

    // ===== RAZA =====
    if (d.raza === "Útero maldito") {
      arr.push({valor:0.3,nombre:"raza"});
    }
    if (d.raza === "Maldición desastre") {
      arr.push({valor:0.4,nombre:"raza"});
    }

    // ===== POTENCIAL =====
    if (d.potencial === "Normal") arr.push({valor:0.2,nombre:"potencial"});
    if (d.potencial === "Medio") arr.push({valor:0.5,nombre:"potencial"});
    if (d.potencial === "Prodigio") arr.push({valor:0.8,nombre:"potencial"});
    if (d.potencial === "Especial") arr.push({valor:1,nombre:"potencial"});

    return arr;
  }

  // ================= POR STAT =================

  function extrasF() {
    let arr = baseExtras();

    if (d.cuerpo === "Cuerpo Reforzado") arr.push({valor:0.5,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo equilibrado") arr.push({valor:0.25,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo extraño") arr.push({valor:0.3,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo bestial") arr.push({valor:0.5,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo Ancla") arr.push({valor:0.3,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo depredador") arr.push({valor:0.1,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo Perfecto") arr.push({valor:0.4,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo Divino") arr.push({valor:0.7,nombre:"cuerpo"});

    if (d.clan === "Zenin") arr.push({valor:0.7,nombre:"Zenin"});
    if (d.clan === "Kamo") arr.push({valor:0.5,nombre:"Kamo"});
    if (d.clan === "Ryomen") arr.push({valor:0.7,nombre:"Ryomen"});
    if (d.clan === "Itadori") arr.push({valor:0.6,nombre:"Itadori"});

    return arr;
  }

  function extrasD() {
    let arr = baseExtras();

    if (d.cuerpo === "Cuerpo Reforzado") arr.push({valor:0.5,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo extraño") arr.push({valor:0.3,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo bestial") arr.push({valor:0.3,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo fantasma") arr.push({valor:0.1,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo Ancla") arr.push({valor:0.5,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo resonante") arr.push({valor:0.1,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo Perfecto") arr.push({valor:0.4,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo Divino") arr.push({valor:0.7,nombre:"cuerpo"});

    if (d.clan === "Gojo") arr.push({valor:0.3,nombre:"Gojo"});
    if (d.clan === "Kamo") arr.push({valor:0.3,nombre:"Kamo"});
    if (d.clan === "Ryomen") arr.push({valor:0.5,nombre:"Ryomen"});

    return arr;
  }

  function extrasV() {
    let arr = baseExtras();

    if (d.cuerpo === "Cuerpo Ligero") arr.push({valor:0.5,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo extraño") arr.push({valor:0.2,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo fantasma") arr.push({valor:0.5,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo Ancla") arr.push({valor:0.1,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo depredador") arr.push({valor:0.3,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo Perfecto") arr.push({valor:0.4,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo Divino") arr.push({valor:0.7,nombre:"cuerpo"});

    if (d.clan === "Gojo") arr.push({valor:0.5,nombre:"Gojo"});
    if (d.clan === "Fujiwara") arr.push({valor:0.5,nombre:"Fujiwara"});
    if (d.clan === "Zenin") arr.push({valor:0.3,nombre:"Zenin"});

    return arr;
  }

  function extrasR() {
    let arr = baseExtras();

    if (d.cuerpo === "Cuerpo Ligero") arr.push({valor:0.5,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo extraño") arr.push({valor:0.2,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo fantasma") arr.push({valor:0.3,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo resonante") arr.push({valor:0.3,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo depredador") arr.push({valor:0.5,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo Perfecto") arr.push({valor:0.4,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo Divino") arr.push({valor:0.7,nombre:"cuerpo"});

    if (d.clan === "Gojo") arr.push({valor:0.7,nombre:"Gojo"});
    if (d.clan === "Fujiwara") arr.push({valor:0.7,nombre:"Fujiwara"});
    if (d.clan === "Zenin") arr.push({valor:0.5,nombre:"Zenin"});

    return arr;
  }

  function extrasRES() {
    let arr = baseExtras();

    if (d.clan === "Kamo") arr.push({valor:0.7,nombre:"Kamo"});
    if (d.clan === "Ryomen") arr.push({valor:0.3,nombre:"Ryomen"});

    return arr;
  }

  function extrasEM() {
    let arr = baseExtras();

    if (d.cuerpo === "Cuerpo de EM") arr.push({valor:0.5,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo resonante") arr.push({valor:0.5,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo Perfecto") arr.push({valor:0.4,nombre:"cuerpo"});
    if (d.cuerpo === "Cuerpo Divino") arr.push({valor:0.7,nombre:"cuerpo"});

    if (d.clan === "Gojo") arr.push({valor:1,nombre:"Gojo"});
    if (d.clan === "Fujiwara") arr.push({valor:0.9,nombre:"Fujiwara"});
    if (d.clan === "Ryomen") arr.push({valor:0.8,nombre:"Ryomen"});
    if (d.clan === "Kamo") arr.push({valor:0.7,nombre:"Kamo"});

    // 🔥 restricción alma
    if (d.restriccion === "Alma por encima del cuerpo") {
      arr.push({valor:10,nombre:"restricción"});
    }

    return arr;
  }

  // 🔥 restricción física global
  let restriccionGlobal = 0;
  if (d.restriccion === "Cuerpo por encima del alma") {
    restriccionGlobal = 2.5;
  }

  // ================= BUILD FINAL =================

  let f = build(1, extrasF(), restriccionGlobal);
  let d = build(1, extrasD(), restriccionGlobal);
  let v = build(1, extrasV(), restriccionGlobal);
  let r = build(1, extrasR(), restriccionGlobal);
  let res = build(1, extrasRES(), restriccionGlobal);
  let em = build(1, extrasEM(), 0); // EM no usa el global

  const embed = new EmbedBuilder()
    .setColor("#00FFCC")
    .setTitle("🧠 Desglose TOTAL de Multiplicadores")
    .setDescription(`👤 Usuario: **${u.username}**`)
    .addFields(
      { name: "💪 Fuerza", value: `${f.texto} = **x${f.total}**` },
      { name: "🛡️ Durabilidad", value: `${d.texto} = **x${d.total}**` },
      { name: "⚡ Velocidad", value: `${v.texto} = **x${v.total}**` },
      { name: "👁️ Reacción", value: `${r.texto} = **x${r.total}**` },
      { name: "🔥 Resistencia", value: `${res.texto} = **x${res.total}**` },
      { name: "🔮 Energía Maldita", value: `${em.texto} = **x${em.total}**` }
    )
    .setFooter({ text: "Incluye raza, potencial, cuerpo, clan y restricción" });

  return msg.reply({ embeds: [embed] });
}


// ================= STATS =================
if (msg.content.startsWith("-stats")) {

  let u = msg.mentions.users.first() || msg.author;
  let d = await Perfil.findOne({ userID: u.id });
  if (!d) return msg.reply("Sin perfil");

  let s = calc(d);
  let m = getMulti(d);

  const embed = new EmbedBuilder()
    .setColor(0x00ffcc)
    .setTitle(`📊 Estadísticas de ${u.username}`)
    .setThumbnail(u.displayAvatarURL({ dynamic: true }))

    .addFields(
      {
        name: "💪 Fuerza",
        value: `${d.stats.fuerza} → ${tabla[d.stats.fuerza].f} × ${m.f.toFixed(2)} = ${s.fuerza}`,
        inline: false
      },
      {
        name: "🛡️ Durabilidad",
        value: `${d.stats.durabilidad} → ${tabla[d.stats.durabilidad].d} × ${m.d.toFixed(2)} = ${s.durabilidad}`,
        inline: false
      },
      {
        name: "🔥 Vida",
        value: `${d.stats.resistencia} → ${tabla[d.stats.resistencia].res} × ${m.res.toFixed(2)} = ${s.resistencia}`,
        inline: false
      },
      {
        name: "⚡ Velocidad",
        value: `${d.stats.velocidad} → ${tabla[d.stats.velocidad].v} × ${m.v.toFixed(2)} = ${s.velocidad}`,
        inline: false
      },
      {
        name: "👁️ Reacción",
        value: `${d.stats.reaccion} → ${tabla[d.stats.reaccion].r} × ${m.r.toFixed(2)} = ${s.reaccion}`,
        inline: false
      },
      {
        name: "🔮 Energía Maldita",
        value: `${d.stats.em} → ${tabla[d.stats.em].em} × ${m.em.toFixed(2)} = ${s.em}`,
        inline: false
      },

      { name: "🎖️ Grado", value: d.grado, inline: true }
    )

    .setFooter({ text: "Sistema Jujutsu RPG" })
    .setTimestamp();

  return msg.reply({ embeds: [embed] });
}

// ================= PERFIL =================
if(msg.content.startsWith("-perfil")){
  let u = msg.mentions.users.first() || msg.author;
  let d = await Perfil.findOne({ userID: u.id });
  if(!d) return msg.reply("Sin perfil");

  const embed = new EmbedBuilder()
  .setTitle(`📜 Perfil`)
  .setDescription(`
Raza: ✦ ${d.raza || "Sin raza"}
────────────────────
Clan: ✦ ${d.clan || "Sin clan"}
Talento: ⚡ ${d.talento || "sin talento"} 
Energía: 🔮 ${d.energia || "sin energía"}
Potencial: 📈 ${d.potencial || "sin potencial"}
Cuerpo: 💪 ${d.cuerpo || "cuerpo normal"}
Restricción: ⛓️ ${d.restriccion || "sin restricción"}
Hereditaria: 🧬 ${d.hereditaria || "sin hereditaria"}
────────────────────
RR disponibles: 🔄 ${d.rr}
Grado: 🎖️ ${d.grado}
  `);

  return msg.reply({embeds:[embed]});
}

if (msg.content.startsWith("-verificar")) {

  // 🔒 Permiso
  if (!msg.member.roles.cache.has(ROL_VERIFICADOR)) {
    return msg.reply("❌ No tienes permisos para verificar");
  }

  const target = msg.mentions.users.first();
  if (!target) {
    return msg.reply("❌ Usa: -verificar @usuario");
  }

  const member = msg.guild.members.cache.get(target.id);
  if (!member) return msg.reply("❌ Usuario no encontrado");

  const ROL_SIN_FICHA = "1416572714424209569";
  const ROL_CON_FICHA = "1499847822495973527";

  try {
    // 🔥 quitar "sin ficha"
    if (member.roles.cache.has(ROL_SIN_FICHA)) {
      await member.roles.remove(ROL_SIN_FICHA);
    }

    // 🔥 agregar "con ficha"
    if (!member.roles.cache.has(ROL_CON_FICHA)) {
      await member.roles.add(ROL_CON_FICHA);
    }

  } catch (err) {
    console.log(err);
    return msg.reply("❌ Error al modificar roles");
  }

  // ================= EMBED =================

  const embed = new EmbedBuilder()
    .setColor("#00FFAA")
    .setTitle("✅ Usuario Verificado")
    .setDescription(
      `🎉 **${target.username} ha sido VERIFICADO**\n\n` +
      `🛡️ Verificado por: **${msg.author.username}**\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `✨ Ya puedes comenzar tu aventura.\n` +
      `🔥 Prepárate para el mundo Jujutsu.\n` +
      `💀 Tu destino empieza ahora...\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━`
    )
    .setThumbnail(target.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: "Sistema de Verificación" })
    .setTimestamp();

  return msg.reply({ embeds: [embed] });
}


});

client.login(TOKEN);
