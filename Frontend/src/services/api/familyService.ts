import axios from 'axios';
import { API_URL } from '../../config';

interface FamilyMember {
  id: number;
  name: string;
  relationship: string;
  age: number;
  canViewMedications: boolean;
  canEditMedications: boolean;
  canManageReminders: boolean;
  status: string;
}

interface FamilyMemberCreate {
  name: string;
  relationship: string;
  age: number;
  canViewMedications: boolean;
  canEditMedications: boolean;
  canManageReminders: boolean;
}

const getAll = async (): Promise<FamilyMember[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/family`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const getById = async (id: number): Promise<FamilyMember> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/family/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const create = async (familyMember: FamilyMemberCreate): Promise<FamilyMember> => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/family`, familyMember, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

const update = async (id: number, familyMember: FamilyMemberCreate): Promise<FamilyMember> => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/family/${id}`, familyMember, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

const remove = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/family/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const familyService = {
  getAll,
  getById,
  create,
  update,
  delete: remove
}; 