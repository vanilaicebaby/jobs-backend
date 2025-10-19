const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: 'eu-central-1' // Vaše AWS region
});

class JobModel {
  static client = new DynamoDBClient({ region: 'eu-central-1' });

  static async findAll(params = {}) {
    const { 
      page = 1, 
      limit = 10 
    } = params;

    const command = new ScanCommand({
      TableName: 'Jobs',
      Limit: Number(limit)
    });

    try {
      const { Items } = await this.client.send(command);
      
      // Transformace DynamoDB items
      const jobs = Items ? Items.map(item => unmarshall(item)) : [];
      
      const startIndex = (page - 1) * limit;
      const paginatedJobs = jobs.slice(startIndex, startIndex + limit);

      return {
        jobs: paginatedJobs,
        totalJobs: jobs.length,
        totalPages: Math.ceil(jobs.length / limit),
        currentPage: Number(page)
      };
    } catch (error) {
      console.error('Chyba při načítání jobů', error);
      throw error;
    }
  }

  static async findById(id) {
    const command = new GetItemCommand({
      TableName: 'Jobs',
      Key: { 
        'id': id  // Ujistěte se, že máte správný partition key
      }
    };

    try {
      const { Item } = await this.client.send(command);
      return Item ? unmarshall(Item) : null;
    } catch (error) {
      console.error('Chyba při načítání jobu', error);
      throw error;
    }
  }
}

module.exports = JobModel;