const db = require('../config/firebasedb');

class ProviderModel {
  static async getProvidersByCategory(category) {
    return new Promise((resolve, reject) => {
      const ref = db.ref(`service_provider/${category}`);
      
      ref.once('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const providers = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          resolve(providers);
        } else {
          resolve([]);
        }
      }, (error) => {
        reject(error);
      });
    });
  }
}

module.exports = ProviderModel;