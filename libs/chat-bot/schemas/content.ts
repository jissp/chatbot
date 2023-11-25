import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({
    name: 'contents',
})
export class Content {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        type: 'text',
    })
    content?: string;

    @Column({
        type: 'varchar',
        length: 64,
    })
    contentHash: string;

    @Column({
        type: 'varchar',
        length: 64,
    })
    vectorContentHash: string;

    @Column({
        type: 'json',
    })
    vectors: any;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: null,
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt!: Date | null;

    @UpdateDateColumn({
        type: 'timestamp',
        default: null,
    })
    vectoredAt!: Date | null;
}
