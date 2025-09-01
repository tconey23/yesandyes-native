// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qjxyqhltyjcagcttlyry.supabase.co'
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqeHlxaGx0eWpjYWdjdHRseXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMDc4NjksImV4cCI6MjA2OTY4Mzg2OX0.XHO4SgaT373iB293snJxL6uaGSdbPa2Lxue9KIEtyeU'
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10, 
    },
  },
})

export const insertPosition = async (positions) => {

const { data, error } = await supabase
  .from('positions')
  .insert(positions)
  .select()
          
}

export const insertActs = async (acts) => {

const { data, error } = await supabase
  .from('actions')
  .insert(acts)
  .select()
          
  console.log(data)
}

export const getPositions = async () => { 

let { data, error } = await supabase
  .from('positions')
  .select('*')

  if(data){
    return data
  } else {
    console.log(error)
  }
}

export const getActs = async () => {

let { data, error } = await supabase 
  .from('actions')
  .select('*')

  if(data){
    return data 
  } else {
    console.log(error)
  }
}

export const fantasyNotification = async (email, name, appBase, sender, fantasyId) => {

  const {
  data: { session },
} = await supabase.auth.getSession()

const accessToken = session?.access_token
  
  const response = await fetch('https://qjxyqhltyjcagcttlyry.supabase.co/functions/v1/fantasy-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      // 'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ email, name, appBase, sender, fantasyId }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return result;
};

// fantasyNotification('tom.ce.coney@gmail.com', 'there', 'http://localhost:5173', 'fcaf5189-cba5-409e-973b-03aff0c4913e', 58)

export const inviteUser = async (email, name, appBase, sender) => {

  console.log(email)

  const {
  data: { session },
} = await supabase.auth.getSession()

const accessToken = session?.access_token
  
  const response = await fetch('https://qjxyqhltyjcagcttlyry.supabase.co/functions/v1/partner-invite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      // 'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ email, name, appBase, sender }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return result;
};

export const getUser = async (id) => {
  let { data: user, error } = await supabase
  .from('user_profiles')
  .select("*")
  .eq('id', id)

  if(error) return

  return user?.[0]
}

export const getFantasies = async (id) => {
  let { data, error } = await supabase
  .from('fantasies')
  .select("*")
  .eq('author_id', id)
  if(error) return
  return data
}

export const fantasyData = async (id) => { 
  let { data, error } = await supabase
  .from('fantasies')
  .select("*")
  .eq('id', id)
    if(error) return
    return data
}

export const updateFantasyPublished = async (id, status, partner, user) => {

  const partnerProfile = await getUser(partner)
  
  const { data, error } = await supabase
  .from('fantasies')
  .update({ published: status })
  .eq('id', id)
  .select()

  if(status){
    fantasyNotification(partnerProfile?.email, 'there', 'yes-and-yes.com', user, id)
  }
  
}

export const getFantasyComments = async (id) => {
  let { data, error } = await supabase
  .from('fantasy_comments')
  .select("*")
  .eq('linked_fantasy', id)

  if(error)return

  return data
}

export const fantasyComment = async (id, auth, text) => {

const { data, error } = await supabase
  .from('fantasy_comments')
  .insert([
    { author_id: auth, comment_text: text, linked_fantasy: id },
  ])
  .select()
          
}

export const insertFantasy = async (text, auth, imgs, pub) => {

  const { data, error } = await supabase
    .from('fantasies')
    .insert([
      { text_content: text, author_id: auth, images: imgs, published: pub},
    ])
    .select()
          
}



// inviteUser('tom.ce.coney@gmail.com', 'Tom')
// .then((res) => console.log('Success:', res))
// .catch((err) => console.error('Error:', err));