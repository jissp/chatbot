import { Injectable } from '@nestjs/common';

const computeCosineSimilarity = require('compute-cosine-similarity');

@Injectable()
export class CosineService {
    public similarity(vectorA: number[], vectorB: number[]): number {
        return computeCosineSimilarity(vectorA, vectorB);
    }
}
