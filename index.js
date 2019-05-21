import Faker from 'faker'
import Mask from 'json-mask'
import Ajv from 'ajv'

import schema from './schema'

const argv = require('yargs')
  .option('size', {
    alias: 's',
    default: 30
  }).argv

const collectionSize = 1000;
const timeGap = 5000;
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

const Mappers = {
  maskTransformTime: [],
  AJVTransformTime: [],
  jsonMask: (collection, collectionSize) => {
    var start = (new Date).getTime()
    for (step = 0; step < collectionSize; step++) {
      Mask(collection[step], masker)
    }
    Mappers.maskTransformTime.push((new Date).getTime()-start)
    console.log('json mask transform time', Mappers.maskTransformTime)
  },
  AJV: (collection, collectionSize) => {
    var start = (new Date).getTime()
    for (step = 0; step < collectionSize; step++) {
      validate(collection[step])
    }
    Mappers.AJVTransformTime.push((new Date).getTime()-start)
    console.log('ajv transform time', Mappers.AJVTransformTime)
  }
}

// Create Data
const collection1 = Generator.collection(collectionSize)
const collection2 = Generator.collection(collectionSize)
const collection3 = Generator.collection(collectionSize)
const collection4 = Generator.collection(collectionSize)

setTimeout(() => Mappers.jsonMask(collection1, collectionSize), 1*timeGap);
setTimeout(() => Mappers.AJV(collection1, collectionSize), 2*timeGap);
setTimeout(() => Mappers.jsonMask(collection2, collectionSize), 3*timeGap);
setTimeout(() => Mappers.AJV(collection2, collectionSize), 4*timeGap);
setTimeout(() => Mappers.AJV(collection3, collectionSize), 5*timeGap);
setTimeout(() => Mappers.jsonMask(collection3, collectionSize), 6*timeGap);
setTimeout(() => Mappers.AJV(collection4, collectionSize), 7*timeGap);
setTimeout(() => Mappers.jsonMask(collection4, collectionSize), 8*timeGap);
setTimeout(() => Mappers.jsonMask(collection1, collectionSize), 9*timeGap);
setTimeout(() => Mappers.AJV(collection1, collectionSize), 10*timeGap);
setTimeout(() => Mappers.jsonMask(collection2, collectionSize), 11*timeGap);
setTimeout(() => Mappers.AJV(collection2, collectionSize), 12*timeGap);

setTimeout(() => {
  console.log('============================')
  let maskSum = Mappers.maskTransformTime.reduce((previous, current) => current += previous)
  let AJVSum = Mappers.AJVTransformTime.reduce((previous, current) => current += previous)
  console.log('json mask transform time', Mappers.maskTransformTime, 'Avg.', maskSum / Mappers.maskTransformTime.length)
  console.log('ajv transform time', Mappers.AJVTransformTime, 'Avg.', AJVSum / Mappers.AJVTransformTime.length)
}, 13*timeGap);