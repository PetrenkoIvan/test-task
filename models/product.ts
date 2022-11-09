import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ createdAt: true, updatedAt: true })
export class Product extends Model {
  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  description: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  amount: number;
}
