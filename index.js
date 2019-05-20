import Faker from 'faker'
import Mask from 'json-mask'
import Ajv from 'ajv'

import schema from './schema'

const argv = require('yargs')
  .option('size', {
    alias: 's',
    default: 30
  }).argv

const collectionSize = 100;
const masker = 'name,profile/(city,country)'
var ajv = new Ajv({removeAdditional: true})
var validate = ajv.compile(schema)

const Generator = {
  user: () => {
    return {
      name: Faker.name.findName(),
      profile: {
        bio: Faker.lorem.paragraph(),
        city: Faker.address.city(),
        country: Faker.address.county()
      },
      age: Faker.random.number(),
      avatar: Faker.internet.avatar(),
      email: Faker.internet.email(),
      location: {
        latitude: Faker.address.latitude(),
        longitude: Faker.address.longitude()
      }
    }
  },
  list: () => {
    var step;
    var list = [];
    for (step = 0; step < argv.size; step++) {
      list.push(Generator.user())
    }
    return list;
  },
  collection: (size) => {
    var step;
    var collection = [];
    for (step = 0; step < size; step++) {
      collection.push(Generator.list())
    }
    return collection;
  }
}

var step;

// Create Data
const startTime = (new Date).getTime()
var collection = Generator.collection(collectionSize)
const generateTime = (new Date).getTime()

// Run JSON-MASK
for (step = 0; step < collectionSize; step++) {
  Mask(collection[step], masker)
}
const maskTransformTime = (new Date).getTime()

// Run AJV
for (step = 0; step < collectionSize; step++) {
  validate(collection[step])
}

const AJVTransformTime = (new Date).getTime()

console.log('generate time', generateTime-startTime)
console.log('jsno mask transform time', maskTransformTime-generateTime)
console.log('ajv transform time', AJVTransformTime-maskTransformTime)