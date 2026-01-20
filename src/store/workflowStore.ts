import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Node, Edge, Connection, NodeChange, EdgeChange } from '@xyflow/react';
import { applyNodeChanges, applyEdgeChanges, reconnectEdge } from '@xyflow/react';
import type { WorkflowNode, BranchNode, ComputationNode } from '../types/workflow';

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;
  guardrailViolations: string[];
  
  // Actions
  addNode: (type: string, position: { x: number; y: number }) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNode | BranchNode | ComputationNode>) => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  reconnectEdge: (oldEdge: Edge, newConnection: Connection) => void;
  setSelectedNode: (id: string | null) => void;
  validateWorkflow: () => string[];
  exportWorkflow: () => Record<string, unknown>;
}

const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useWorkflowStore = create<WorkflowState>()(
  immer((set, get) => ({
  nodes: [
    {
      id: 'start',
      type: 'start',
      position: { x: 500, y: 100 },
      data: { label: 'Start' },
    },
    {
      id: 'avatar_height',
      type: 'avatarStep',
      position: { x: 45, y: 255 },
      data: {
        category: 'vitals',
        videoId: 'vid_height',
        questionText: 'What is your height?',
        inputType: 'number' as const,
        isMandatory: true,
        variableName: 'height',
      },
    },
    {
      id: 'avatar_weight',
      type: 'avatarStep',
      position: { x: 480, y: 300 },
      data: {
        category: 'vitals',
        videoId: 'vid_weight',
        questionText: 'What is your weight?',
        inputType: 'number' as const,
        isMandatory: true,
        variableName: 'weight',
      },
    },
    {
      id: 'compute_bmi',
      type: 'computation',
      position: { x: 930, y: 330 },
      data: {
        label: 'Calculate BMI',
        formula: 'weight / (height * height)',
        outputVariable: 'bmi',
      },
    },
    {
      id: 'branch_bmi',
      type: 'branch',
      position: { x: 975, y: 825 },
      data: {
        label: 'BMI Classification',
        conditions: [
          {
            id: 'condition_underweight',
            variable: 'bmi',
            operator: '<' as const,
            value: 15,
            targetNodeId: 'avatar_underweight',
          },
          {
            id: 'condition_overweight',
            variable: 'bmi',
            operator: '>' as const,
            value: 30,
            targetNodeId: 'avatar_overweight',
          },
          {
            id: 'condition_normal',
            variable: 'bmi',
            operator: '>=' as const,
            value: 15,
            targetNodeId: 'avatar_normal',
          },
        ],
      },
    },
    {
      id: 'avatar_underweight',
      type: 'avatarStep',
      position: { x: 585, y: 1410 },
      data: {
        category: 'symptoms',
        videoId: 'vid_pain',
        questionText: 'You are underweight. Please consult with a healthcare provider.',
        inputType: 'none' as const,
        isMandatory: false,
      },
    },
    {
      id: 'avatar_overweight',
      type: 'avatarStep',
      position: { x: 930, y: 1410 },
      data: {
        category: 'symptoms',
        videoId: 'vid_headache',
        questionText: 'You are overweight. Please consult with a healthcare provider.',
        inputType: 'none' as const,
        isMandatory: false,
      },
    },
    {
      id: 'avatar_normal',
      type: 'avatarStep',
      position: { x: 1275, y: 1410 },
      data: {
        category: 'onboarding',
        videoId: 'vid_welcome',
        questionText: 'Your BMI is within normal range.',
        inputType: 'none' as const,
        isMandatory: false,
      },
    },
    {
      id: 'end',
      type: 'end',
      position: { x: 1035, y: 2025 },
      data: { label: 'End' },
    },
  ],
  edges: [
    {
      id: 'edge_start_height',
      source: 'start',
      target: 'avatar_height',
      type: 'default',
    },
    {
      id: 'edge_height_weight',
      source: 'avatar_height',
      target: 'avatar_weight',
      type: 'default',
    },
    {
      id: 'edge_weight_compute',
      source: 'avatar_weight',
      target: 'compute_bmi',
      type: 'default',
    },
    {
      id: 'edge_compute_branch',
      source: 'compute_bmi',
      target: 'branch_bmi',
      type: 'default',
    },
    {
      id: 'edge_branch_underweight',
      source: 'branch_bmi',
      target: 'avatar_underweight',
      sourceHandle: 'condition_underweight',
      type: 'default',
    },
    {
      id: 'edge_branch_overweight',
      source: 'branch_bmi',
      target: 'avatar_overweight',
      sourceHandle: 'condition_overweight',
      type: 'default',
    },
    {
      id: 'edge_branch_normal',
      source: 'branch_bmi',
      target: 'avatar_normal',
      sourceHandle: 'condition_normal',
      type: 'default',
    },
    {
      id: 'edge_underweight_end',
      source: 'avatar_underweight',
      target: 'end',
      type: 'default',
    },
    {
      id: 'edge_overweight_end',
      source: 'avatar_overweight',
      target: 'end',
      type: 'default',
    },
    {
      id: 'edge_normal_end',
      source: 'avatar_normal',
      target: 'end',
      type: 'default',
    },
  ],
  selectedNode: null,
  guardrailViolations: [],

  addNode: (type: string, position: { x: number; y: number }) => {
    console.log('Adding node:', { type, position });
    const newNode = {
      id: generateId(),
      type,
      position,
      data: type === 'avatarStep' 
        ? {
            category: '',
            videoId: '',
            questionText: '',
            inputType: 'choice' as const,
            isMandatory: false,
          }
        : type === 'branch'
        ? {
            label: 'Branch Node',
            conditions: [],
          }
        : type === 'computation'
        ? {
            label: 'Computation Node',
            formula: '',
            outputVariable: '',
          }
        : { label: `${type} node` },
      draggable: true,
    };
    
    console.log('New node created:', newNode);
    
    set(state => {
      console.log('Previous nodes:', state.nodes);
      state.nodes.push(newNode);
      console.log('Updated nodes:', state.nodes);
    });
  },

  updateNodeData: (id: string, data: Partial<WorkflowNode | BranchNode | ComputationNode>) => {
    set(state => {
      const node = state.nodes.find(n => n.id === id);
      if (node) {
        Object.assign(node.data, data);
      }
    });
  },

  deleteNode: (id: string) => {
    set(state => {
      state.nodes = state.nodes.filter(node => node.id !== id);
      state.edges = state.edges.filter(edge => edge.source !== id && edge.target !== id);
    });
  },

  deleteEdge: (id: string) => {
    set(state => {
      const edgeToDelete = state.edges.find(edge => edge.id === id);
      state.edges = state.edges.filter(edge => edge.id !== id);
      
      if (edgeToDelete) {
        state.nodes.forEach(node => {
          if (node.type === 'branch' && edgeToDelete.source === node.id) {
            const nodeData = node.data as BranchNode;
            const condition = nodeData.conditions.find(c => c.id === edgeToDelete.sourceHandle);
            if (condition) {
              condition.targetNodeId = '';
            }
          }
        });
      }
    });
  },

  onNodesChange: (changes: NodeChange[]) => {
    set(state => {
      state.nodes = applyNodeChanges(changes, state.nodes);
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set(state => {
      state.edges = applyEdgeChanges(changes, state.edges);
    });
  },

  onConnect: (connection: Connection) => {
    const newEdge: Edge = {
      id: `edge_${connection.source}_${connection.target}_${connection.sourceHandle || 'default'}`,
      source: connection.source!,
      target: connection.target!,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: 'default',
    };
    
    set(state => {
      state.edges.push(newEdge);
      
      const sourceNode = state.nodes.find(node => node.id === connection.source);
      if (sourceNode && sourceNode.type === 'branch') {
        const nodeData = sourceNode.data as BranchNode;
        const condition = nodeData.conditions.find(c => c.id === connection.sourceHandle);
        if (condition && connection.target) {
          condition.targetNodeId = connection.target;
        }
      }
    });
  },

  reconnectEdge: (oldEdge: Edge, newConnection: Connection) => {
    set(state => {
      state.edges = reconnectEdge(oldEdge, newConnection, state.edges);
      
      state.nodes.forEach(node => {
        if (node.id === newConnection.source && node.type === 'branch') {
          const nodeData = node.data as BranchNode;
          const condition = nodeData.conditions.find(c => c.id === newConnection.sourceHandle);
          if (condition && newConnection.target) {
            condition.targetNodeId = newConnection.target;
          }
        }
        if (node.id === oldEdge.source && node.type === 'branch') {
          const nodeData = node.data as BranchNode;
          const condition = nodeData.conditions.find(c => c.id === oldEdge.sourceHandle);
          if (condition && condition.targetNodeId === oldEdge.target) {
            condition.targetNodeId = '';
          }
        }
      });
    });
  },

  setSelectedNode: (id: string | null) => {
    set(state => {
      state.selectedNode = id;
    });
  },

  validateWorkflow: () => {
    const { nodes, edges } = get();
    const violations: string[] = [];

    // Check for orphaned nodes (except start)
    const connectedNodeIds = new Set(
      edges.flatMap(e => [e.source, e.target])
    );
    
    nodes.forEach(node => {
      if (node.id !== 'start' && !connectedNodeIds.has(node.id)) {
        violations.push(`Node "${node.data.label || node.id}" has no incoming connections`);
      }
    });

    // Check for missing video IDs in avatar step nodes
    nodes.forEach(node => {
      if (node.type === 'avatarStep') {
        const data = node.data as WorkflowNode;
        if (!data.videoId) {
          violations.push(`Avatar step "${data.questionText || node.id}" is missing a video selection`);
        }
      }
    });

    // Check for variable integrity in branch nodes and computation nodes
    const definedVariables = new Set<string>();
    nodes.forEach(node => {
      if (node.type === 'avatarStep') {
        const data = node.data as WorkflowNode;
        if (data.variableName) {
          definedVariables.add(data.variableName);
        }
      }
      if (node.type === 'computation') {
        const data = node.data as ComputationNode;
        if (data.outputVariable) {
          definedVariables.add(data.outputVariable);
        }
      }
    });

    nodes.forEach(node => {
      if (node.type === 'branch') {
        const data = node.data as BranchNode;
        data.conditions.forEach(condition => {
          if (!definedVariables.has(condition.variable)) {
            violations.push(`Branch node uses undefined variable "${condition.variable}"`);
          }
        });
      }
      if (node.type === 'computation') {
        const data = node.data as ComputationNode;
        if (data.formula && !data.outputVariable) {
          violations.push(`Computation node "${data.label || node.id}" is missing output variable name`);
        }
        if (!data.formula && data.outputVariable) {
          violations.push(`Computation node "${data.label || node.id}" is missing formula`);
        }
      }
    });

    // Check for end nodes
    const hasEndNode = nodes.some(node => node.type === 'end');
    if (!hasEndNode) {
      violations.push('Workflow must have at least one End node');
    }

    set(state => {
      state.guardrailViolations = violations;
    });
    return violations;
  },

  exportWorkflow: () => {
    const { nodes, edges } = get();
    
    const steps = nodes
      .filter(node => node.type === 'avatarStep')
      .map(node => {
        const data = node.data as WorkflowNode;
        
        return {
          id: node.id,
          video: data.videoId,
          question: data.questionText,
          inputType: data.inputType,
          isMandatory: data.isMandatory,
          variableName: data.variableName,
        };
      });

    return {
      version: '1.0',
      metadata: {
        name: 'Medical Intake Workflow',
        nodeCount: nodes.length,
        edgeCount: edges.length,
      },
      steps,
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      })),
    };
  },
  }))
);