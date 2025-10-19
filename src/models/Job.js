const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: 'eu-central-1' // Vaše AWS region
});

class JobModel {
  static async findAll(params = {}) {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      industry 
    } = params;

    const scanParams = {
      TableName: 'Jobs',
      Limit: Number(limit)
    };

    try {
      const result = await dynamodb.scan(scanParams).promise();
      
      // Manuální stránkování
      const startIndex = (page - 1) * limit;
      const paginatedJobs = result.Items.slice(startIndex, startIndex + limit);

      return {
        jobs: paginatedJobs,
        totalJobs: result.Items.length,
        totalPages: Math.ceil(result.Items.length / limit),
        currentPage: Number(page)
      };
    } catch (error) {
      console.error('Chyba při načítání jobů', error);
      throw error;
    }
  }

  static async findById(id) {
    const params = {
      TableName: 'Jobs',
      Key: { 
        'id': id  // Ujistěte se, že máte správný partition key
      }
    };

    try {
      const result = await dynamodb.get(params).promise();
      return result.Item;
    } catch (error) {
      console.error('Chyba při načítání jobu', error);
      throw error;
    }
  }
}

module.exports = JobModel;