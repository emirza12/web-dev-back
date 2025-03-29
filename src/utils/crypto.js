import bcrypt from 'bcryptjs'  

export function getHashFromClearText (text){
    return bcrypt.hashSync(text, 10)
}

export const compareHash = bcrypt.compareSync;
