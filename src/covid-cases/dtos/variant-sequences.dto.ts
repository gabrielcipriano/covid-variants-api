export class VariantSequencesDto {
  variant: string;
  num_sequences: number;

  constructor(variant: string, num_sequences: number) {
    this.variant = variant;
    this.num_sequences = num_sequences;
  }
}
