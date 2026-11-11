## Map X
Components:
- ML practitioner (Person)
- Hugging Face Hub (External · Hugging Face Hub)
- Tiny Shakespeare text (External · GitHub raw file)
- Weights & Biases (External · optional)
- OpenWebText prep (Script · data/openwebtext/prepare.py)
- Shakespeare BPE prep (Script · data/shakespeare/prepare.py)
- Character-level prep (Script · data/shakespeare_char/prepare.py)
- Token files (Files · data/ per dataset)
- Checkpoint (File · out_dir/ckpt.pt)
- Configurator (Component · configurator.py)
- Run setup and model init (Component · train.py setup)
- Batch loader (Component · get_batch())
- Training loop (Component · train.py while loop)
- DDP peer processes (Worker pool · torchrun ranks)
- Evaluate and checkpoint (Component · estimate_loss + save)
- GPT model (Component · model.py GPT)
- Transformer block (Component · model.py Block)
- GPT-2 weight import (Component · GPT.from_pretrained)
- Autoregressive sampler (Component · GPT.generate)
- Sampling script (Script · sample.py)
- Benchmark script (Script · bench.py)
Flows:
- Prepare a dataset
- Start a training run from scratch
- One training iteration
- Evaluate and save a checkpoint
- Sample text from a trained model

## Map Y
Components:
- ML practitioner (Person)
- Hugging Face Hub (External · Hugging Face Hub)
- Tiny Shakespeare text (External · GitHub raw file)
- Weights & Biases (External · optional)
- OpenWebText prep (Script · data/openwebtext/prepare.py)
- Shakespeare BPE prep (Script · data/shakespeare/prepare.py)
- Character-level prep (Script · data/shakespeare_char/prepare.py)
- Token files (Files · data/ per dataset)
- Checkpoint (File · out_dir/ckpt.pt)
- Configurator (Component · configurator.py)
- Run setup and model init (Component · train.py setup)
- Batch loader (Component · get_batch())
- Training loop (Component · train.py while loop)
- Evaluate and checkpoint (Component · estimate_loss + save)
- GPT model (Component · model.py GPT)
- Transformer block (Component · model.py Block)
- GPT-2 weight import (Component · GPT.from_pretrained)
- Autoregressive sampler (Component · GPT.generate)
- Sampling script (Script · sample.py)
- Benchmark script (Script · bench.py)
Flows:
- Prepare a dataset
- Start a finetune from GPT-2
- One training iteration
- Evaluate and save a checkpoint
- Sample text from a trained model
