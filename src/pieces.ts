export class Pieces {
  Null: number;
  Pawn: number;
  Knight: number;
  Bishop: number;
  Rook: number;
  Queen: number;
  King: number;

  Light: number;
  Dark: number;

  constructor() {
    this.Null = 0;
    this.Pawn = 1;
    this.Knight = 2;
    this.Bishop = 3;
    this.Rook = 4;
    this.Queen = 5;
    this.King = 6;

    this.Light = 16;
    this.Dark = 8;
  }
}