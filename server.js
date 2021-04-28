const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')
const path = require('path')
const fs = require('fs')
const shortid = require('shortid')

const typeDefs = gql`
  type Query {
    hello: String!
  }

  type Mutation {
    uploadFile(file: Upload!): String
  }
`

const resolvers = {
  Query: {
    hello: () => 'Hello World!'
  },
  Mutation: {
    uploadFile: async (_, { file }) => {
      const { filename, createReadStream } = await file
      const id = shortid.generate()
      const { ext, name } = path.parse(filename)
      const stream = createReadStream()
      const filePath = path.join(__dirname, `./public/images/${name}-${id}${ext}`)
      console.log(filePath);
      const writeStream = fs.createWriteStream(filePath)
      await stream.pipe(writeStream)
      return `http://localhost:4000/images/${filename}`
      return filePath
    }



// 
//       try{
//         const { createReadStream, filename, encoding, mimetype } = await file;
//         const { ext, name } = path.parse(filename);
// 
//         const validType = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(ext);
// 
//         if (!validType) {
//           return new Error("Please Select image");
//         }
//         const id = shortid.generate()
// 
//         const pathName = path.join(__dirname, `/public/images/${name}-${id}${ext}`)
// 
//         const stream = createReadStream();
// 
//         await new Promise((resolve, reject) => {
//           const writeStream = fs.createWriteStream(pathName);
//           writeStream.on("finish", resolve);
//           writeStream.on("error", (error) => {
//             fs.unlink(pathName, () => {
//               reject(error);
//             });
//           });
//           stream.on("error", (error) => writeStream.destroy(error));
//           stream.pipe(writeStream);
//         });
// 
//         return `http://localhost:4000/images/${pathName}`
//       }
//       catch (err){
//         console.log(err);
//       }
//     }

  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
})

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

server.applyMiddleware({app})

app.use(express.static('public'))


app.listen({ port: 4000}, () => {
  console.log(`🚀 Server ready at http://localhost:4000}`)
})
