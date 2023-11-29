import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({
    name: 'datasets',
})
export class Dataset {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({
        type: 'varchar',
        length: 255,
    })
    title: string;

    @Column({
        type: 'text',
    })
    content!: string;

    @Column({
        type: 'json',
    })
    vector?: any;

    @Column({
        type: 'integer',
        unsigned: true,
    })
    tokenCount?: number | null;

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
