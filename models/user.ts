import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ createdAt: true, updatedAt: true })
export class User extends Model {
  @Column({
    type: DataType.UUID,
    unique: true,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  userName: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  lastName: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  password: string;
}
