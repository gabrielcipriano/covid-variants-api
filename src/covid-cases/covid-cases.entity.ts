import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class CovidCase {
  @PrimaryColumn()
  location: string;

  @PrimaryColumn({ type: 'date' })
  date: string;

  @PrimaryColumn()
  variant: string;

  @Column({ type: 'int' })
  num_sequences: number;

  constructor(
    location: string,
    date: string,
    variant: string,
    num_sequences: number,
  ) {
    this.location = location;
    this.date = date;
    this.variant = variant;
    this.num_sequences = num_sequences;
  }
}
